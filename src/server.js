import {ApolloServer} from 'apollo-server'
import {schema} from './schema'
import { connectDb } from './core/mongoClient'

const server = new ApolloServer({
    schema
})

server.listen(4000).then(({url, subscriptionsUrl}) => {
    console.log(`🚀 Serving at ${url}`)
})

// connecting to database
process.nextTick(() => {
  connectDb().then((db) => {
    // eslint-disable-next-line no-console
    console.log('Database Connected: ', db);
  }).catch((err) => {
    console.log('Failed to connect to db: ', err);
    process.exit(1);
  });
});

module.exports = server;