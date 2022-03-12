const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    lowercase: true,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    lowercase: true,
    required: [true, 'Please add a last name']
  },
  email: {
    type: String,
    lowercase:true,
    required: [true, 'Please add an email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  }
}, 
{
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

// IMPLEMENT A STRIPPED DOWN BASIC VERSION FIRST
// const UserSchema = mongoose.Schema({
//   firstName: {
//     type: String,
//     lowercase: true,
//     required: [true, 'Please add a first name'],
//   },
//   lastName: {
//     type: String,
//     lowercase: true,
//     required: [true, 'Please add a last name']
//   },
//   age: {
//     type: Number,
//     min: 18,
//     max:30,
//     required: true
//   },
//   bio: {
//     type: String,
//     maxLength: 500 
//   },
//   gender: {
//     type: String,
//     lowercase: true
//   },
//   email: {
//     type: String,
//     lowercase: true
//   },
//   phone: String,
//   education: String,
//   occupation: String,
//   origin: String,
//   targets: [{type: String}],
//   hidden: Boolean,
// },
// {
//   timestamps: true
// });