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


describe("Query User", () => {
    describe("Query.user.list", () => {
        it("should return all the users", async () => {
            const query = `query Query {
                user {
                  list {
                    userID
                    name
                    username
                    created_at
                    updated_at
                  }
                }
              }`;
            const response = await graphql(schema, query);
            expect(response.data).to.have.property('user');
            expect(response.data?.user).to.have.property('list');
            for (let item of response.data.user.list) {
                expect(item).to.have.property('userID');
                expect(item).to.have.property('name');
                expect(item).to.have.property('username');
                expect(item).to.have.property('created_at');
                expect(item).to.have.property('updated_at');
            }
        })
    })
    describe("Query.user.get", () => {
        it("should return all the users", async () => {
            const query = `query Query($getIdentifier: String!) {
                user {
                  get(identifier: $getIdentifier) {
                    userID
                    name
                    username
                    created_at
                    updated_at
                  }
                }
              }`;
            const response = await graphql(schema, query,null,null, {
                'getIdentifier': 'test_user_0@email.com'
            });
            expect(response.data).to.have.property('user');
            expect(response.data?.user).to.have.property('get');
            expect(response.data?.user?.get).to.have.property('userID');
            expect(response.data?.user?.get).to.have.property('name');
            expect(response.data?.user?.get).to.have.property('username');
            expect(response.data?.user?.get).to.have.property('created_at');
            expect(response.data?.user?.get).to.have.property('updated_at');
        })
    })
})
