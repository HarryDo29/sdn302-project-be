const mongoose = require('mongoose');

const config = require('./config');

const globalForMongoose = globalThis;

if (!globalForMongoose.__quizAppMongo) {
  globalForMongoose.__quizAppMongo = {
    conn: null,
    promise: null
  };
}

async function connectToDatabase() {
  if (!config.mongoUrl) {
    throw new Error('Missing MongoDB connection string');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (globalForMongoose.__quizAppMongo.conn) {
    return globalForMongoose.__quizAppMongo.conn;
  }

  if (!globalForMongoose.__quizAppMongo.promise) {
    globalForMongoose.__quizAppMongo.promise = mongoose.connect(config.mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
  }

  await globalForMongoose.__quizAppMongo.promise;
  globalForMongoose.__quizAppMongo.conn = mongoose.connection;

  return globalForMongoose.__quizAppMongo.conn;
}

module.exports = {
  connectToDatabase
};