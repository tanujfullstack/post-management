import * as Posts from '../models/posts'
import * as Replies from '../models/replies'


export async function listPosts(pageSize, pageNumber) {
    const posts = await Posts.getAll({
        pageNumber,
        pageSize,
        sortBy: {
            created_at: -1
        }
    });
    return posts;
}

export async function getByPostID(postID, commentLimit, replyDepth) {
    const post = await Posts.getByPostID(postID, commentLimit, replyDepth);
    return JSON.parse(JSON.stringify(post));
}

export async function getByUser(authorIdentifier, commentLimit, pageSize, pageNumber) {
    return Posts.getByUsernameOrUserID({authorIdentifier, commentLimit, pageSize, pageNumber });
    
}

export async function createPost({ authorIdentifier, content }) {
    return Posts.create({ authorIdentifier, content });
}

export async function updatePost({ postID, content }) {
    return Posts.update({ postID, content });
}

export async function removePost(postID) {
    return Posts.remove(postID);
}

export async function removeComment(commentID) {
    return Posts.removeComment(commentID);
}

export async function commentOnPost({ postID, authorIdentifier, content }) {
    return Posts.comment({ postID, authorIdentifier, content });
}

export async function replyToComment({ authorIdentifier, commentID, content }) {
    return Replies.addReplyToComment({ authorIdentifier, commentID, content });
}