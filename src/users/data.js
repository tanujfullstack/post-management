import { create, getAll, getByUsernameOrUserID, update, remove } from '../models/users';


export async function listUsers() {
    return getAll({
        pageNumber: 1,
        pageSize: 10,
        sortBy: {
            created_at: -1
        }
    })
}

export async function getUser(identifier) {
    return getByUsernameOrUserID(identifier);
}

export async function createUser({ username, name }) {
    return create({ username, name });
}

export async function updateUser(identifier, { username, name }) {
    return update(identifier, { username, name });
}