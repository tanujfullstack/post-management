const convict = require('convict');

const config = convict({
  url: {
    test: {
      doc: 'MongoDB test url',
      format: String,
      default: 'mongodb://0.0.0.0:27017/userpoststest',
      env: 'MONGO_TEST_DB_URL',
    },

    development: {
      doc: 'MongoDB url',
      format: String,
      default: 'mongodb://0.0.0.0:27017/userpostsdevelopment',
      env: 'MONGO_DB_URL',
    },
    production: {
      doc: 'MongoDB url',
      format: String,
      default: 'mongodb://0.0.0.0:27017/userpostsproduction',
      env: 'MONGO_DB_URL',
    },
  },
});

config.validate({ allowed: 'strict' });

module.exports = config;
