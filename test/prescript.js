import { connectDb } from '../src/core/mongoClient'

// connecting to database
process.nextTick(() => {
  connectDb().then((db) => {
    console.log('Database Connected: ', db);
  }).catch((err) => {
    console.log('Failed to connect to db: ', err);
    process.exit(1);
  });
});

