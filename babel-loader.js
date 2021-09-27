// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  });
  
  // eslint-disable-next-line no-console
  console.log('Running=>', process.argv[2]);
  // eslint-disable-next-line import/no-dynamic-require
  require(process.argv[2]);
  