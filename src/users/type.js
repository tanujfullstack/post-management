import {GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql'

export const User = new GraphQLObjectType({
    name: 'User',
    description: 'The user',
    fields: () => ({
        userID: {
            type: GraphQLID,
            description: 'The unique user id'
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The user name'
        },
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The username'
        },
        created_at: {
            type: GraphQLNonNull(GraphQLFloat),
            description: 'User create time'
        },
        updated_at: {
            type: GraphQLNonNull(GraphQLFloat),
            description: 'User update time'
        }
    })
})

export const UserInput = new GraphQLInputObjectType({
    name: 'UserInput',
    description: 'User create type',
    fields: {
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The user name'
        },
        username: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The user role'
        },
    }
})