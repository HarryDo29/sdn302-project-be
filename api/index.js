const serverless = require('serverless-http');

const app = require('../src/app');
const { connectToDatabase } = require('../src/db');

const handler = serverless(app);

module.exports = async (req, res) => {
  await connectToDatabase();
  return handler(req, res);
};