const quizService = require('../services/quizService');

async function getQuizzes(req, res, next) {
  try {
    const quizzes = await quizService.getQuizzes();
    return res.json(quizzes);
  } catch (err) {
    return next(err);
  }
}

async function createQuiz(req, res, next) {
  try {
    const quiz = await quizService.createQuiz(req.body);
    return res.status(201).json(quiz);
  } catch (err) {
    return next(err);
  }
}

async function deleteQuizzes(req, res, next) {
  try {
    const result = await quizService.deleteQuizzes();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function getQuizById(req, res, next) {
  try {
    const quiz = await quizService.getQuizById(req.params.quizId);
    return res.json(quiz);
  } catch (err) {
    return next(err);
  }
}

async function addQuestionsToQuiz(req, res, next) {
  try {
    console.log('Adding questions to quiz:', req.params.quizId, 'with body:', req.body);
    const quiz = await quizService.addQuestionsToQuiz(req.params.quizId, req.body);
    return res.status(201).json(quiz);
  } catch (err) {
    return next(err);
  }
}

async function updateQuiz(req, res, next) {
  try {
    const quiz = await quizService.updateQuiz(req.params.quizId, req.body);
    return res.json(quiz);
  } catch (err) {
    return next(err);
  }
}

async function deleteQuiz(req, res, next) {
  try {
    const result = await quizService.deleteQuiz(req.params.quizId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addQuestionsToQuiz,
  createQuiz,
  deleteQuiz,
  deleteQuizzes,
  getQuizById,
  getQuizzes,
  updateQuiz
};
