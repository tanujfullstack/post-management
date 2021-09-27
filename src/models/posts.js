const Users = require('./users');
const mongoose = require('mongoose');
const uuid = require('uuid');
const Replies = require('./replies');

const commentSchema = new mongoose.Schema({
	commentID: {
		type: String,
		default() {
			return uuid.v4()
		},
		required: true,
		immutable: true,
	},
	ts: {
		type: Date,
		default: Date.now,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	content: {
		type: String,
		set: (data) => {
			return data ? Buffer.from(JSON.stringify(data)).toString('base64') : data;
		},
		get: (data) => {
			return data ? JSON.parse(Buffer.from(data, 'base64').toString()) : data;
		},
		required: true,
	}
})

const postsSchema = new mongoose.Schema({
	postID: {
		type: String,
		default() { return uuid.v4() },
		immutable: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	content: {
		type: String,
		set: (data) => {
			return data ? Buffer.from(JSON.stringify(data)).toString('base64') : data;
		},
		get: (data) => {
			return data ? JSON.parse(Buffer.from(data, 'base64').toString()) : data;
		},
		required: true,
	},
	comments: [commentSchema],
	created_at: {
		type: Date,
		default: Date.now,
		required: true,
	},
	updated_at: {
		type: Date,
		default: Date.now,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
		required: true,
	},
	deleted: {
		type: Boolean,
		default: false,
		required: true,
	},
});

postsSchema.path('comments.commentID')

postsSchema.index({
	postID: 1,
	'comments.commentID': -1 // since this is a timestamp based ID, we keep it in descending order
}, {
	unique: true,
	name: 'post_id_comments_comment_id_unique_idx' // for a postID, commentID should always be unique
});

postsSchema.index({
	author: 1
}, {
	name: 'author_idx'
})

postsSchema.index({
	created_at: -1,
	updated_at: -1
}, {
	name: 'created_at_updated_at_idx'
});

const model = mongoose.model('Posts', postsSchema);

module.exports = {
	model,
	create: async ({ authorIdentifier, content }) => {
		const author = await Users.getByUsernameOrUserID(authorIdentifier);
		if (!author) {
			throw Error("Author not found")
		}
		const post = await model.create({
			content,
			author: author._id
		});
		return { ... post._doc, author } ;
	},
	getAll: async ({ pageNumber, pageSize, sortBy }) => {

		return (await model.find(
			{
				active: true,
				deleted: false
			},
			['-active', '-deleted'],
			{
				skip: pageSize * (pageNumber - 1),
				limit: pageSize,
				sort: sortBy
			}
		).populate('author').populate('comments.author'))
	},
	getByPostID: async (postID, commentLimit = 2, replyDepth = 1) => {
		
		const post = (await model.findOne(
			{
				postID,
				active: true,
				deleted: false,
			},
			{
				comments: {
					$slice: -1*commentLimit
				}
			}
		).populate('author').populate('comments.author'));

		// if greater than 0, then we load replies as well
		let replies;
		if (replyDepth > 0 && post) {
			replies = await Replies.model.aggregate([
				{
					$graphLookup: {
						from: "replies",
						startWith: "$replyID",
						connectFromField: "replyID",
						connectToField: "parentEntityID",
						as: "replies",
					}
				},
				{
					$match: {
						parentEntityType: 'comment',
						parentEntityID: {
							$in: post.comments.map((c) => {
								return c.commentID;
							})
						}
					}
				},
				{
					$sort: {
						ts: -1
					}
				}

			]);
		}
		post._doc.content = post._doc.content ? JSON.parse(Buffer.from(post._doc.content, 'base64').toString()) : post._doc.content;
		post.comments.map((c) => {
			c._doc.content = c._doc.content ? JSON.parse(Buffer.from(c._doc.content, 'base64').toString()) : c._doc.content;
			c._doc['replies'] = replies ? replies.filter((r) => {
				if (r.parentEntityID === c.commentID) {
					r.content = r.content ? JSON.parse(Buffer.from(r.content, 'base64').toString()) : r.content;
				}
				return r.parentEntityID === c.commentID
			}) : [];
		});
		return post._doc;
	},
	getByUsernameOrUserID: async ({authorIdentifier, commentLimit, pageSize = 10, pageNumber = 1}) => {
		const author = await Users.getByUsernameOrUserID(authorIdentifier);
		if (!author) {
			throw Error("Author not found")
		}
		return (await model.find(
			{
				author: author._id,
				active: true,
				deleted: false,
			},
			{	
				postID: 1,
				content: 1,
				comments: 1,
				created_at: 1,
				updated_at: 1,
				comments: {
					$slice: -1*commentLimit
				}
			},
			{
				skip: pageSize * (pageNumber - 1),
				limit: pageSize,
				sort: {
					created_at: -1
				}
			}
		).populate('author').populate('comments.author'));
	},
	getCommentByCommentID: async (commentID) => {
		return (await model.findOne({
			'comments.commentID': commentID
		}, {
			comment: {
				$elemMatch: {
					commentID: commentID,
				}
			}
		}).populate('comments.author'));
	},
	update: async ({ postID, content }) => {
		return await model.findOneAndUpdate(
			{
				postID,
				active: true,
				deleted: false,
			}, {
				content,
				updated_at: Date.now()
			}, {
				returnOriginal: false
			}
		).populate('author').populate('comments.author');
	},
	comment: async({ postID, authorIdentifier, content }) => {
		const author = await Users.getByUsernameOrUserID(authorIdentifier);
		if (!author) {
			throw Error("Author not found")
		}
		return await model.findOneAndUpdate({
			postID,
			active: true,
			deleted: false,
		},
		{
			$push: {
				comments: {
					content,
					author: author._id
				}
			}
		},
		{
			returnOriginal: false
		}
		).populate('author').populate('comments.author');
	},
	removeComment: async (commentID) => {
		const post = await model.findOne({
			'comments.commentID': commentID,
			active: true,
			deleted: false
		});

		if (!post) {
			throw Error('Post not found')
		}

		await Replies.model.deleteMany({
			parentEntityID: commentID
		});

		return await model.findOneAndUpdate({
			postID: post.postID,
		}, {
			$pull: {
				comments: {
					commentID,
				}
			}
		}, {
			returnOriginal: false
		}).populate('author').populate('comments.author');;
	},

	remove: async (postID) => {

		const post = await model.findOneAndUpdate(
			{
				postID
			},
			{
				active: false,
				deleted: true,
				updated_at: Date.now()
			}, {
				returnOriginal: true
			}
		).populate('author').populate('comments.author');

		return post;
	}
}



