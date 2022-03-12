const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require('../utilities/jwt');

const User = require('../models/userModel');


const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // check that all required fields are included
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  // error if user already exists
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // hash user password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create a new user document
  await User.create({
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword
  }, (err, user) => {
    if (err) throw new Error(err.message);
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check for user email
  const user = await User.findOne({ email });

  // compare credentials
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  } 
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// const editUserProfile = asyncHandler(async (req, res) => {
//   res.json({msg: 'edit user profile', user: req.user})
// });

// const deleteUserProfile = asyncHandler(async (req, res) => {
//   res.json({msg: 'delete user profile', user: req.user})
// });

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile,
  // editUserProfile,
  // deleteUserProfile
};