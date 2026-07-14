const express = require('express');

const authenticate = require('../authenticate');
const questionController = require('../controllers/questionController');

const router = express.Router();

router.route('/')
  .get(questionController.getQuestions)
  .post(authenticate.verifyUser, questionController.createQuestion)

router.route('/:questionId')
  .get(questionController.getQuestionById)
  .put(authenticate.verifyUser, authenticate.verifyAuthor, questionController.updateQuestion)
  .delete(authenticate.verifyUser, authenticate.verifyAuthor, questionController.deleteQuestion);

module.exports = router;
