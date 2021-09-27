import { create, comment, model } from '../../src/models/posts';

export function clean() {
    return model.deleteMany({});
}

export async function seedPosts(count = 3) {
    const postIDs = []
    for (let i = 0; i < count; i++) {
        let post = await create({
            authorIdentifier: `test_user_${i}@email.com`,
            content: `Sample Content ${i}`
        });
        postIDs.push(post.postID);
    }
    return postIDs;
}

export async function seedComments(postIDs, count = 3) {
    for (let id of postIDs) {
        for (let i = 0; i < count; i++) {
            await comment({
                postID: id,
                authorIdentifier: `test_user_${i}@email.com`,
                content: `Sample Comment ${i}`
            });
        }
    }
    
}
