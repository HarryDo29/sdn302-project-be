const crypto = require('crypto');

const authService = require('./authService');
const config = require('../config');
const User = require('../models/user');


function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function authError(message, status = 400) {
  return createError(message, status);
}

async function setPassword(user, password) {
  if (typeof password !== 'string' || password.length === 0) {
    throw authError('No password was given');
  }

  const salt = (await randomBytes(passwordOptions.saltLength)).toString(passwordOptions.encoding);
  const hash = await hashPassword(password, salt);

  user.salt = salt;
  user.hash = hash;

  return user;
}

async function register(username, isAdmin, password) {
  if (!username) {
    throw authError('No username was given');
  }

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    throw authError('A user with the given username is already registered');
  }

  const hashedPassword = await authService.hashPassword(password);

  const newUser = new User({
    username: username,
    password: hashedPassword,
    admin: Boolean(isAdmin)
  });

  return newUser.save();
}

async function findByCredentials(username, password) {
  if (!username || typeof password !== 'string' || password.length === 0) {
    return null;
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    return null;
  }
  const isValidPassword = await authService.checkPassword(password, user.password);
  return isValidPassword ? user : null;
}

function publicUser(user) {
  return {
    _id: user._id,
    username: user.username,
    admin: user.admin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function getUsers() {
  const users = await User.find({});
  return users.map(publicUser);
}

async function signup({ username, password, adminCode }) {
  if (!username || !password) {
    throw createError('Username and password are required.', 400);
  }

  const isAdmin = Boolean(config.adminSignupCode && adminCode === config.adminSignupCode);
  const user = await register(username, isAdmin, password);

  return publicUser(user);
}

async function login({ username, password }) {
  const user = await findByCredentials(username, password);

  if (!user) {
    throw createError('Invalid username or password.', 401);
  }

  return {
    token: authService.getToken({ _id: user._id, admin: user.admin }),
    user: publicUser(user)
  };
}

async function getProfile(userId) {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw createError('User not found.', 404);
  }
  return publicUser(user);
}

module.exports = {
  findByCredentials,
  getUsers,
  getProfile,
  login,
  publicUser,
  register,
  setPassword,
  signup
};
