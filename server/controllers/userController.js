const asyncHandler = require('express-async-handler');
const generateToken = require('../utilities/jwt');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');


const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, eduEmail, password } = req.body;

  // check that all required fields are included (will need validation)
  if (!firstName || !lastName || !eduEmail || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // check if user exists
  const userExists = await User.findOne({ eduEmail });

  // error if user already exists
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // hash user password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create a new user document
  const user = await User.create({
    firstName,
    lastName,
    eduEmail,
    password: hashedPassword
  });

  // don't actually want to return user object
  res.status(201).json(user);
});

const loginUser = asyncHandler(async (req, res) => {
  const { eduEmail, password } = req.body;  // need to clean and validate

  // check for user eduEmail
  const user = await User.findOne({ eduEmail });

  // compare credentials
  if (user && (await bcrypt.compare(password, user.password))) {
    // generate access and refresh tokens
    const accessToken = generateToken('access', user._id);
    const refreshToken = generateToken('refresh', user._id);

    // save user document with refreshToken
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      eduEmail: user.eduEmail,
      accessToken: accessToken
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  } 
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  // currently returns logged in user as well
  const filter = { hidden: { $eq: false } };
  const projection = { _id: 0, firstName: 1, lastName: 1 };

  const users = await User.aggregate([
    { $match: filter },
    { $project: projection }
  ]);

  if (!users) {
    console.log('call to get all users failed');
    res.status(400).json({msg: 'failed to get all users'});
  }

  res.status(200).json(users);
});

const editUserProfile = asyncHandler(async (req, res) => {
  const update = req.body;    // the update object needs to be in the correct shape... validation 

  User.findByIdAndUpdate(req.user._id, update, { new: true }, (err, user) => {
    if (err) {
      console.log(`Failed to find and update: ${err.message}`);
      res.status(400).json({ msg: 'failed to edit user' });
    }
    console.log('user:');
    console.log(user);
    res.status(200).json(user);
  });
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.user?._id);

  if (!deletedUser) {
    res.status(500);
    throw new Error('Failed to delete user');
  }

  res.status(200).json(deletedUser);
});

const hideUserProfile = asyncHandler(async (req, res) => {
  const user = User.findByIdAndUpdate(req.user?._id, { "hidden": true }, { new: true });

  if (!user) {
    res.status(500);
    throw new Error('User not found');
  }
  
  res.status(200).json({msg: `User (${user.firstName} ${user.firstName}) hidden`});
});

const unhideUserProfile = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.user?._id, { "hidden": false }, { new: true }, (err, user) => {
    if (err) {
      console.log(`Failed to unhide user: ${err.message}`);
      res.status(400).json({ msg: 'failed to unhide user' });
    }
    console.log(`USER UNHIDDEN: ${user.firstName} ${user.lastName}`);
    res.status(200).json(user);
  });
});

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getAllUsers,
  editUserProfile,
  deleteUserProfile,
  hideUserProfile,
  unhideUserProfile
};