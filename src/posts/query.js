import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLID, GraphQLInt } from 'graphql'
import { listPosts, getByPostID, getByUser } from './data'
import { Post } from './type';

const GetPostByPostID  = {
    type: Post,
    description: Post.description,
    args: {
        postID: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The postID'
        },
        commentLimit: {
            type: GraphQLInt,
            description: 'Number of comments to return'
        },
        replyDepth: {
            type: GraphQLInt,
            description: 'The depth of replies on comments',
        }
    },
    resolve: async (source, args) => {
        return getByPostID(args.postID, args.commentLimit, args.replyDepth)
    },
}

const GetPostByUser  = {
    type: GraphQLList(Post),
    description: Post.description,
    args: {
        authorIdentifier: {
            type: GraphQLNonNull(GraphQLID),
            description: 'The username or userID'
        },
        commentLimit: {
            type: GraphQLInt,
            description: 'Number of comments to return'
        },
        pageSize: {
            type: GraphQLInt,
            description: 'Records per page'
        },
        pageNumber: {
            type: GraphQLInt,
            description: 'Page number'
        }
    },
    resolve: async (source, args) => {
        return getByUser(args.authorIdentifier, args.commentLimit, args.pageSize, args.pageNumber);
    },
}

const ListPosts = {
    type: GraphQLList(Post),
    description: Post.description,
    args: {
        pageSize: {
            type: GraphQLInt,
            description: 'Records per page'
        },
        pageNumber: {
            type: GraphQLInt,
            description: 'Page number'
        }
    },
    resolve: async (source, args) => {
        return listPosts(args.pageSize, args.pageNumber)
    }
}

export const PostQuery = new GraphQLObjectType({
    name: 'PostQuery',
    description: 'The post base query',
    fields: {
        getByPostID: GetPostByPostID,
        getByUser: GetPostByUser,
        list: ListPosts
    }
})