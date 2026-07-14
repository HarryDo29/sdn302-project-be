const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('../config');

function getToken(user) {
  return jwt.sign(user, config.secretKey, { expiresIn: config.tokenExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, config.secretKey);
}

// Số vòng băm (salt rounds). 10 là mức cân bằng hoàn hảo giữa bảo mật và tốc độ.
const saltRounds = 10;

const hashPassword = async (plainPassword) => {
  try {
    // Chỉ cần truyền số 10 vào đây, bcrypt sẽ TỰ ĐỘNG sinh ra salt và trộn vào giúp bạn
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Lỗi mã hóa mật khẩu');
  }
};

const checkPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Lỗi kiểm tra mật khẩu');
  }
};

module.exports = {
  getToken,
  verifyToken,
  hashPassword,
  checkPassword,
};
