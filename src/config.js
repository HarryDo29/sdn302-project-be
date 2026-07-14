require('dotenv').config();

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

module.exports = {
  mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URL,
  port: process.env.PORT || 3000,
  secretKey: process.env.JWT_SECRET || 'development-secret-change-me',
  tokenExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  adminSignupCode: process.env.ADMIN_SIGNUP_CODE || '',
  allowedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...clientUrls
  ]
};
