const app = require('../src/app');
const { connectToDatabase } = require('../src/db');

module.exports = async (req, res) => {
  if (req.url === '/api/health' || req.url === '/health') {
    return res.status(200).json({
      success: true,
      message: 'API is healthy'
    });
  }

//   await connectToDatabase();
  return app(req, res);
};