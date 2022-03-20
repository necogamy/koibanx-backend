module.exports = {
  'port': 3000,
  'mongodb': {
    'username': process.env.DATABASE_USERNAME,
    'password': process.env.DATABASE_PASSWORD,
    'dbname': process.env.DATABASE_DBNAME,
    'clusterUrl': process.env.DATABASE_CLUSTERURL
  },
};
