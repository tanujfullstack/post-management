import { graphql } from 'graphql';
import { schema } from '../../src/schema';
import chai, { assert, expect } from 'chai';
import { seed, clean } from '../seed';


chai.should();

before(async () => {
    await seed();
});

after(async () => {
    await clean();
});


describe("Query Posts", () => {
    describe("Query.post.list", () => {
        it("should return all the posts", async () => {
            const query = `query Query {
                post {
                  list {
                    postID
                    content
                    created_at
                    updated_at
                    author {
                      userID
                      name
                      username
                      created_at
                      updated_at
                    }
                    comments {
                      commentID
                      author {
                        userID
                        name
                        username
                        created_at
                        updated_at
                      }
                      content
                      replies {
                        ts
                        content
                        author
                        replyID
                      }
                      ts
                    }
                  }
                }
              }`;
            const response = await graphql(schema, query);
            expect(response.data).to.have.property('post');
            expect(response.data?.post).to.have.property('list');
            for (let item of response.data.post.list) {
                expect(item).to.have.property('postID');
                expect(item).to.have.property('content');
                expect(item).to.have.property('comments');
                expect(item).to.have.property('author');
                expect(item).to.have.property('created_at');
                expect(item).to.have.property('updated_at');
            }
        })
    })
    describe("Query.user.getByUser", () => {
        it("should return all the post of user", async () => {
            const query = `query Query($getByUserAuthorIdentifier: ID!, $getByUserCommentLimit: Int, $getByUserPageSize: Int, $getByUserPageNumber: Int) {
                post {
                  getByUser(authorIdentifier: $getByUserAuthorIdentifier, commentLimit: $getByUserCommentLimit, pageSize: $getByUserPageSize, pageNumber: $getByUserPageNumber) {
                    postID
                    content
                    created_at
                    updated_at
                    author {
                      userID
                      name
                      username
                      created_at
                      updated_at
                    }
                    comments {
                      commentID
                      author {
                        userID
                        name
                        username
                        created_at
                        updated_at
                      }
                      content
                      replies {
                        ts
                        content
                        author
                        replyID
                      }
                      ts
                    }
                  }
                }
              }`;
            const response = await graphql(schema, query,null,null, {
                "getByUserAuthorIdentifier": "test_user_2@email.com",
                "getByUserCommentLimit": 2,
                "getByUserPageSize": 10,
                "getByUserPageNumber": 1
              });
            expect(response.data).to.have.property('post');
            expect(response.data?.post).to.have.property('getByUser');
            for (let item of response.data?.post?.getByUser) {
                expect(item).to.have.property('postID');
                expect(item).to.have.property('content');
                expect(item).to.have.property('comments');
                expect(item.comments).to.have.length(2);
                expect(item).to.have.property('author');
                expect(item).to.have.property('created_at');
                expect(item).to.have.property('updated_at');
            }
        })
    })
})
