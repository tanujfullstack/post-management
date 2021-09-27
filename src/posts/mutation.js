import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql'
import {Post, PostInput, Reply} from './type'
import { createPost, updatePost, commentOnPost, replyToComment, removePost, removeComment } from './data'

const CreatePost = {
    type: Post,
    description: Post.description,
    args: {
        input: {
            type: GraphQLNonNull(PostInput),
            description: PostInput.description
        }
    },
    resolve: (parent, args) => {
        return createPost({
            authorIdentifier: args.input?.authorIdentifier,
            content: args.input?.content
        });
    }
}

const UpdatePost = {
    type: Post,
    description: Post.description,
    args: {
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Update content'
        },
        postID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'User update tim'
        }
    },
    resolve: (parent, args) => {
        return updatePost({
            postID: args.postID,
            content: args.content
        });
    }
}

const RemovePost = {
    type: Post,
    description: Post.description,
    args: {
        postID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'post ID'
        }
    },
    resolve: (parent, args) => {
        return removePost(args.postID);
    }
}

const RemoveComment = {
    type: Post,
    description: Post.description,
    args: {
        commentID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'comment ID'
        }
    },
    resolve: (parent, args) => {
        return removeComment(args.commentID);
    }
}

const CommentOnPost = {
    type: Post,
    description: Post.description,
    args: {
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Comment content'
        },
        authorIdentifier: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The user id or username'
        },
        postID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The post id'
        }
    },
    resolve: (parent, args) => {
        return commentOnPost({
            postID: args.postID,
            content: args.content,
            authorIdentifier: args.authorIdentifier,
        });
    }
}

const ReplyToComment = {
    type: Reply,
    description: Reply.description,
    args: {
        content: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Comment content'
        },
        authorIdentifier: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The user id or username'
        },
        commentID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The comment id'
        }
    },
    resolve: (parent, args) => {
        return replyToComment({
            authorIdentifier: args.authorIdentifier,
            commentID: args.commentID,
            content: args.content,
        });
    }
}


export const PostMutation = new GraphQLObjectType({
    name: 'PostMutation',
    description: 'The post base mutation',
    fields: {
        create: CreatePost,
        update: UpdatePost,
        remove: RemovePost,
        removeComment: RemoveComment,
        addComment: CommentOnPost,
        replyToComment: ReplyToComment
    }
})