const questionService = require('../services/questionService');

async function getQuestions(req, res, next) {
  try {
    const questions = await questionService.getQuestions();
    return res.json(questions);
  } catch (err) {
    return next(err);
  }
}

async function createQuestion(req, res, next) {
  try {
    const question = await questionService.createQuestion(req.body, req.user._id);
    return res.status(201).json(question);
  } catch (err) {
    return next(err);
  }
}

function rejectQuestionsPut(req, res, next) {
  return next(questionService.notSupported('PUT', '/questions'));
}

async function deleteQuestionsByAuthor(req, res, next) {
  try {
    const result = await questionService.deleteQuestionsByAuthor(req.user._id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function getQuestionById(req, res, next) {
  try {
    const question = await questionService.getQuestionById(req.params.questionId);
    return res.json(question);
  } catch (err) {
    return next(err);
  }
}

function rejectQuestionPost(req, res, next) {
  return next(questionService.notSupported('POST', `/questions/${req.params.questionId}`));
}

async function updateQuestion(req, res, next) {
  try {
    const questionId = req.params.questionId;
    const question = await questionService.updateQuestion(questionId, req.body);
    return res.json(question);
  } catch (err) {
    return next(err);
  }
}

async function deleteQuestion(req, res, next) {
  try {
    const questionId = req.params.questionId;
    const result = await questionService.deleteQuestion(questionId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createQuestion,
  deleteQuestion,
  deleteQuestionsByAuthor,
  getQuestionById,
  getQuestions,
  rejectQuestionPost,
  rejectQuestionsPut,
  updateQuestion
};
