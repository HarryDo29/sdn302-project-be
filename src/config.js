require('dotenv').config();

module.exports = {
  mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URL,
  port: process.env.PORT || 3000,
  secretKey: process.env.JWT_SECRET || 'development-secret-change-me',
  tokenExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  adminSignupCode: process.env.ADMIN_SIGNUP_CODE || '',
  allowedOrigins: [
    'http://localhost:5173',
    'https://sdn302-project-fe.vercel.app/',
  ]
};
