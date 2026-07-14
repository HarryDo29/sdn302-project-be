const userService = require('../services/userService');

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    return res.json(users);
  } catch (err) {
    return next(err);
  }
}

async function signup(req, res, next) {
  try {
    const user = await userService.signup(req.body);

    return res.status(201).json({
      success: true,
      status: 'Registration Successful!',
      user
    });
  } catch (err) {
    err.status = err.status || 400;
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, user } = await userService.login(req.body);

    return res.json({
      success: true,
      token,
      status: 'You are successfully logged in!',
      user
    });
  } catch (err) {
    return next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await userService.getProfile(req.userId);
    console.log('User profile:', user);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

function checkJWTToken(req, res) {
  return res.json({
    success: true,
    status: 'JWT valid.',
    user: userService.getProfile(req.user)
  });
}

module.exports = {
  checkJWTToken,
  getMe,
  getUsers,
  login,
  signup
};
