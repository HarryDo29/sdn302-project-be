const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
