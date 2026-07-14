const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'correctAnswerIndex must be an integer.'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
