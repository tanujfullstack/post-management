const convict = require('convict');

const config = convict({
  env: {
    doc: 'App Environment',
    format: ['production', 'development', 'qa', 'uat', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Port to bind',
    format: 'port',
    default: 4000,
    env: 'PORT',
  }
});

config.validate({ allowed: 'strict' });

module.exports = config;
