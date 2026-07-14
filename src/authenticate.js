const User = require('./models/user');
const Question = require('./models/question');
const authService = require('./services/authService');

exports.getToken = authService.getToken;

function unauthorized(message) {
  const err = new Error(message || 'Unauthorized');
  err.status = 401;
  return err;
}

function getBearerToken(req) {
  const authorization = req.get('authorization');

  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return null;
  }

  return match[1].trim();
}

exports.verifyUser = async function verifyUser(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return next(unauthorized('Authentication token is missing.'));
    }

    const payload = authService.verifyToken(token);
    const user = await User.findById(payload._id);

    if (!user) {
      return next(unauthorized('User not found.'));
    }

    req.userId = user._id;
    req.user = user;
    return next();
  } catch (err) {
    err.status = err.status || 401;
    return next(err);
  }
};

function forbidden(message) {
  const err = new Error(message);
  err.status = 403;
  return err;
}

exports.verifyAdmin = async function verifyAdmin(req, res, next) {
  if (req.user && req.user.admin === true) {
    return next();
  }

  return next(forbidden('You are not authorized to perform this operation!'));
};

exports.verifyAuthor = async function verifyAuthor(req, res, next) {
  try {
    const questionId = req.params.questionId || req.body.questionId;

    if (!questionId) {
      const err = new Error('Question id is required to verify the author.');
      err.status = 400;
      return next(err);
    }

    const question = await Question.findById(questionId);

    if (!question) {
      const err = new Error('Question not found.');
      err.status = 404;
      return next(err);
    }

    if (question.author && question.author._id.equals(req.user._id)) {
      req.question = question;
      return next();
    }

    return next(forbidden('You are not the author of this question'));
  } catch (err) {
    return next(err);
  }
};
