const Quiz = require('../models/quiz');

function createError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function quizPayload(body) {
  return {
    title: body.title,
    description: body.description || '',
    questions: body.questions || []
  };
}

function applyQuizUpdates(body) {
  const updates = {};

  if (body.title !== undefined) {
    updates.title = body.title;
  }

  if (body.description !== undefined) {
    updates.description = body.description;
  }

  if (body.questions !== undefined) {
    updates.questions = body.questions;
  }

  return updates;
}

function getBulkQuizzes(body) {
  if (Array.isArray(body)) {
    return body;
  }

  if (Array.isArray(body.quizzes)) {
    return body.quizzes;
  }

  return null;
}

async function getQuizzes() {
  return Quiz.find({}).populate('questions');
}

async function createQuiz(body) {
  const quiz = await Quiz.create(quizPayload(body));
  return quiz.populate('questions');
}

async function deleteQuizzes() {
  const result = await Quiz.deleteMany({});

  return {
    success: true,
    deletedCount: result.deletedCount,
    message: 'All quizzes deleted.'
  };
}

async function getQuizById(quizId) {
  const quiz = await Quiz.findById(quizId).populate('questions');

  if (!quiz) {
    throw createError('Quiz not found.', 404);
  }

  return quiz;
}

async function addQuestionsToQuiz(quizId, body) {
  const questionIds = Array.isArray(body.questions)
    ? body.questions
    : [body.questionId].filter(Boolean);

  if (questionIds.length === 0) {
    throw createError('POST /quizzes/:quizId expects questionId or questions array.', 400);
  }

  const quiz = await Quiz.findById(quizId);
  console.log('Found quiz:', quiz);

  if (!quiz) {
    throw createError('Quiz not found.', 404);
  }

  const existingIds = new Set(quiz.questions.map((question) => question.toString()));

  questionIds.forEach((questionId) => {
    if (!existingIds.has(questionId.toString())) {
      quiz.questions.push(questionId);
    }
  });

  await quiz.save();
  return quiz.populate('questions');
}

async function updateQuiz(quizId, body) {
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    applyQuizUpdates(body),
    { new: true, runValidators: true }
  ).populate('questions');

  if (!quiz) {
    throw createError('Quiz not found.', 404);
  }

  return quiz;
}

async function deleteQuiz(quizId) {
  const quiz = await Quiz.findByIdAndDelete(quizId);

  if (!quiz) {
    throw createError('Quiz not found.', 404);
  }

  return {
    success: true,
    message: 'Quiz deleted.'
  };
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
