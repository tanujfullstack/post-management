import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { listUsers, getUser } from './data'
import { User } from './type';

const GetUser  = {
    type: User,
    description: User.description,
    args: {
        identifier: {
            type: GraphQLNonNull(GraphQLString),
            description: 'The username or userID'
        }
    },
    resolve: async (source, args) => {
        return getUser(args.identifier)
    },
}

const ListUsers = {
    type: GraphQLList(User),
    description: User.description,
    resolve: async () => {
        return listUsers()
    }
}

export const UserQuery = new GraphQLObjectType({
    name: 'UserQuery',
    description: 'The user base query',
    fields: {
        get: GetUser,
        list: ListUsers
    }
})