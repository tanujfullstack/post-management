const mongoose = require('mongoose');
const mongoClientConfig = require('../config/mongoClientConfig');
const appConfig = require('../config/appConfig');

const mongoUrl = mongoClientConfig.get(`url.${appConfig.get('env')}`);

async function connectDb() {
  await mongoose.set('useCreateIndex', true);
  await mongoose.set('useNewUrlParser', true);
  await mongoose.set('useFindAndModify', false);
  await mongoose.set('useUnifiedTopology', true);
  await mongoose.connect(mongoUrl, { useNewUrlParser: true });
  return mongoose.connection.host;
}

function getMongoConnection() {
  return mongoose.connection;
}

module.exports = { 
    connectDb,
    getMongoConnection
 };
