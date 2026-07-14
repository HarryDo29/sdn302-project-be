const serverless = require('serverless-http');

const app = require('../src/app');
const { connectToDatabase } = require('../src/db');

const handler = serverless(app);

module.exports = async (req, res) => {
  if (req.url === '/api/health' || req.url === '/health') {
    return res.status(200).json({
      success: true,
      message: 'API is healthy'
    });
  }

  await connectToDatabase();
  return handler(req, res);
};