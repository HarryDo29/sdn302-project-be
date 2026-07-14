const Question = require('../models/question');

function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function notSupported(method, path) {
  return createError(`${method} operation not supported on ${path}`, 405);
}

function questionPayload(body, authorId) {
  return {
    text: body.text,
    author: authorId,
    options: body.options,
    keywords: body.keywords || [],
    correctAnswerIndex: body.correctAnswerIndex
  };
}

function normalizeAnswerIndex(value) {
  if (Number.isInteger(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) ? parsedValue : value;
  }

  return value;
}

function validateQuestion(question) {
  const options = question.options;
  const correctAnswerIndex = normalizeAnswerIndex(question.correctAnswerIndex);

  if (!Array.isArray(options) || options.length < 2) {
    throw createError('A question requires at least two options.', 400);
  }

  if (Number.isInteger(correctAnswerIndex) && correctAnswerIndex >= options.length) {
    throw createError('correctAnswerIndex must point to an option.', 400);
  }

  return question;
}

function applyQuestionUpdates(question, body) {
  if (body.text !== undefined) {
    question.text = body.text;
  }

  if (body.options !== undefined) {
    question.options = body.options;
  }

  if (body.keywords !== undefined) {
    question.keywords = body.keywords;
  }

  if (body.correctAnswerIndex !== undefined) {
    question.correctAnswerIndex = body.correctAnswerIndex;
  }

  return question;
}

async function getQuestions() {
  return Question.find({}).populate('author', 'username admin');
}

async function createQuestion(body, authorId) {
  const payload = questionPayload(body, authorId);
  validateQuestion(payload);

  const question = await Question.create(payload);
  return question.populate('author', 'username admin');
}

async function deleteQuestionsByAuthor(authorId) {
  const result = await Question.deleteMany({ author: authorId });

  return {
    success: true,
    deletedCount: result.deletedCount,
    message: 'Deleted questions submitted by the authenticated author.'
  };
}

async function getQuestionById(questionId) {
  const question = await Question.findById(questionId).populate('author', 'username admin');

  if (!question) {
    throw createError('Question not found.', 404);
  }

  return question;
}

async function updateQuestion(questionId, body) {
  const question = await Question.findById(questionId);

  if (!question) {
    throw createError('Question not found.', 404);
  }

  applyQuestionUpdates(question, body);
  validateQuestion(question);

  const savedQuestion = await question.save();
  return savedQuestion.populate('author', 'username admin');
}

async function deleteQuestion(questionId) {
  const question = await Question.findById(questionId);

  if (!question) {
    throw createError('Question not found.', 404);
  }

  await question.deleteOne();

  return {
    success: true,
    message: 'Question deleted.'
  };
}

module.exports = {
  createQuestion,
  deleteQuestion,
  deleteQuestionsByAuthor,
  getQuestionById,
  getQuestions,
  notSupported,
  updateQuestion,
  validateQuestion
};
