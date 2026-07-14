const app = require('../src/app');
const { connectToDatabase } = require('../src/db');

module.exports = async (req, res) => {
  // OPTIONS cần đi qua Express CORS ngay, không cần database
  if (req.method === 'OPTIONS') {
    return app(req, res);
  }

  // Health check cũng không cần database
  if (req.url === '/api/health' || req.url === '/health') {
    return app(req, res);
  }

  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development'
        ? error.message
        : undefined
    });
  }
};