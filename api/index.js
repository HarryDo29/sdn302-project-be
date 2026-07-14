const app = require('../src/app');
const { connectToDatabase } = require('../src/db');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    console.log('Database connection established');
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
};