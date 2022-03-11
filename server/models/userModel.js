const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  bio: String,
  gender: String,
  email: String,
  phone: String,
  education: String,
  occupation: String,
  origin: String,
  targets: [{type: String}],
  hidden: Boolean,
},
{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);