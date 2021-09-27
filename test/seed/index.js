import * as user from './users.seed';
import * as post from './posts.seed';

export async function seed() {
    await user.clean();
    await post.clean();
    await user.seed();
    const postIDs = await post.seedPosts();
    await post.seedComments(postIDs);
}

export async function clean() {
    await user.clean();
    await post.clean();
}