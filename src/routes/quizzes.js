const express = require('express');

const authenticate = require('../authenticate');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.route('/')
  .get(quizController.getQuizzes)
  .post(authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz)
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuizzes);

router.route('/:quizId')
  .get(quizController.getQuizById)
  .put(authenticate.verifyUser, authenticate.verifyAdmin, quizController.updateQuiz)
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuiz);

module.exports = router;
