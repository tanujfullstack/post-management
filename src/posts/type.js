import {GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } from 'graphql'
import { User } from '../users/type'


export const Reply = new GraphQLObjectType({
    name: 'Reply',
    description: 'The reply',
    fields: () => ({
        replyID: {
            type: GraphQLID,
			description: 'ID of the reply'
        },
        author: {
			type: GraphQLID,
			description: 'Author of the comment'
		},
		content: {
			type: GraphQLNonNull(GraphQLString),
            description: 'The content'
		},
        ts: {
            type: (GraphQLString),
            description: 'Comment create time'
        }
    })
})

export const Comment = new GraphQLObjectType({
    name: 'Comment',
    description: 'The comment',
    fields: () => ({
        commentID: {
			type: GraphQLID,
			description: 'ID of the comment'
		},
		author: {
			type: GraphQLNonNull(User),
			description: 'Author of the comment'
		},
		content: {
			type: GraphQLNonNull(GraphQLString),
            description: 'The content'
		},
        replies: {
            type: GraphQLList(Reply),
            description: 'Reply to comment'
        },
        ts: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Comment create time'
        }
    })
})

export const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'The post',
    fields: () => ({
        postID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The unique post id'
        },
        author: {
            type: GraphQLNonNull(User),
            description: 'The author of the post'
        },
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The content'
        },
        comments: {
            type: GraphQLList(Comment),
            description: 'The comments'
        },
        created_at: {
            type: GraphQLNonNull(GraphQLFloat),
            description: 'Post create time'
        },
        updated_at: {
            type: GraphQLNonNull(GraphQLFloat),
            description: 'Post update time'
        }
    })
})

export const PostInput = new GraphQLInputObjectType({
    name: 'PostInput',
    description: 'Post create type',
    fields: {
        authorIdentifier: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The username or userID'
        },
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Text content'
        },
    }
})