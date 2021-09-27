const mongoose = require('mongoose');
const Users = require('./users');
const uuid = require('uuid');

const repliesSchema = new mongoose.Schema({
	replyID: {
		type: String,
		default() {
			return uuid.v4()
		},
		immutable: true,
	},
	author: {
		type: String,
		required: true
	},
	content: {
		type: String,
		set: (data) => {
			return Buffer.from(JSON.stringify(data)).toString('base64');
		},
		get: (data) => {
			return JSON.parse(Buffer.from(data, 'base64').toString());
		},
		required: true,
	},
	parentEntityType: {
		type: String,
		enum: ['comment', 'reply'],
		default: 'comment'
	},
	parentEntityID: {
		type: String,
		required: true,
	},
	ts: {
		type: Date,
		default: Date.now,
		required: true,
	}
});

repliesSchema.index({
	replyID: -1
}, {
	unique: true,
	name: 'reply_id_unique_idx'
})

repliesSchema.index({
	parentEntityID: 1
}, {
	name: 'parent_entity_id_unique_idx'
})

repliesSchema.index({
	created_at: -1, // latest first
	updated_at: -1, // latest first
}, {
	name: 'created_at_updated_at_idx'
});

repliesSchema.index({
	author: 1
}, {
	name: 'author_idx'
})

const model = mongoose.model('Replies', repliesSchema);

module.exports = {
	model,
	'getByReplyID': async(replyID) => {
		return await model.findOne({
			replyID,
		}).populate('author');
	},
	'addReplyToComment': async ({ authorIdentifier, commentID, content }) => {
		const Posts = require('./posts');
		const author = await Users.getByUsernameOrUserID(authorIdentifier);
		if (!author) {
			throw Error('Author not found')
		}
		const comment = await Posts.getCommentByCommentID(commentID);
		if (!comment) {
			throw Error('Comment not found')
		}
		const reply = await model.create({
			content,
			parentEntityType: 'comment',
			parentEntityID: commentID,
			author: author.username,
		});
		return reply;
	},
	'addReplyToReply': async function({ authorIdentifier, replyID, content }) {
		const author = await Users.getByUsernameOrUserID(authorIdentifier);
		if (!author) {
			throw Error('Author not found')
		}
		let reply = await this.getByReplyID(replyID);
		if (!reply) {
			throw Error('Reply not found')
		}
		reply = await model.create({
			content,
			parentEntityType: 'reply',
			parentEntityID: replyID,
			author: author.username,
		});
		return reply;
	}
}

