import { create, model } from '../../src/models/users';

export function clean() {
    return model.deleteMany({});
}

export async function seed(count = 3) {
    const userObjIDs = [];
    for (let i = 0; i < count; i++) {
        let user = await create({
            username: `test_user_${i}@email.com`,
            name: `test name ${i}`
        });
        userObjIDs.push(user._id)
    }
    return userObjIDs
}
