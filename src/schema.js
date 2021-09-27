import {GraphQLObjectType, GraphQLSchema} from 'graphql'
import { UserQuery } from './users/query'
import { UserMutation } from './users/mutation'
import { PostQuery } from './posts/query'
import { PostMutation } from './posts/mutation'

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'The base query',
    fields: {
        user: {
            type: UserQuery,
            description: UserQuery.description,
            resolve: () => { return {} }
        },
        post: {
            type: PostQuery,
            description: PostQuery.description,
            resolve: () => { return {} }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The base mutation',
    fields: {
        user: {
            type: UserMutation,
            description: UserMutation.description,
            resolve: () => { return {} }
        },
        post: {
            type: PostMutation,
            description: PostMutation.description,
            resolve: () => { return {} }
        },
    }
})

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})
