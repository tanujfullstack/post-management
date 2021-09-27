import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import {User, UserInput} from './type'
import { createUser, updateUser } from './data'

const CreateUser = {
    type: User,
    description: User.description,
    args: {
        input: {
            type: GraphQLNonNull(UserInput),
            description: UserInput.description
        }
    },
    resolve: (parent, args) => {
        return createUser({
            name: args.input?.name,
            username: args.input?.username
        });
    }
}

const UpdateUser = {
    type: User,
    description: User.description,
    args: {
        input: {
            type: GraphQLNonNull(UserInput),
            description: UserInput.description
        },
        identifier: {
            type: GraphQLNonNull(GraphQLString),
            description: 'User update time'
        }
    },
    resolve: (parent, args) => {
        return updateUser(args.identifier,
            {
            name: args.input?.name,
            username: args.input?.username
        });
    }
}

export const UserMutation = new GraphQLObjectType({
    name: 'UserMutation',
    description: 'The user base mutation',
    fields: {
        create: CreateUser,
        update: UpdateUser,
    }
})