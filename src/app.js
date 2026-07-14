const express = require('express');
const cors = require('cors');

const config = require('./config');
const { connectToDatabase } = require('./db');

const usersRouter = require('./routes/users');
const quizzesRouter = require('./routes/quizzes');
const questionsRouter = require('./routes/questions');

const app = express();

app.use(cors({
    origin: 'https://sdn302-project-fe.vercel.app', // Điền đúng URL Frontend của bạn (không có dấu / ở cuối)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Đảm bảo cho phép method OPTIONS
    credentials: true // Bật cái này nếu API của bạn có lưu cookie/token
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy'
  });
});

app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);
app.use('/questions', questionsRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    status,
    message: err.message || 'Internal Server Error'
  });
});

async function start() {
  await connectToDatabase();
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

module.exports = app;
