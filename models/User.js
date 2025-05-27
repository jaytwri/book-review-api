const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {                 // Required for login/authentication
    type: String,
    required: true,
    unique: true,
  },
  password: {              // Will store hashed password
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
