const asyncHandler = require('express-async-handler');
const { generateToken, _idFromJWT, expiryDateFromJWT } = require('../utilities/jwt');
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

  const user = await User.findOne({ eduEmail });

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  if (await bcrypt.compare(password, user.password)) {
    const expiryDate = user.refreshToken ? 1000 * expiryDateFromJWT(user.refreshToken) : 0;   

    // check if refresh token has expired
    if (Date.now() < expiryDate) {
      res.redirect('refresh');
    } else {
      // refreshToken has expired, grant new login
      const accessToken = generateToken('access', user._id);
      const refreshToken = generateToken('refresh', user._id);

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
    }
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const getNewAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const _id = _idFromJWT(refreshToken);

  const user = await User.findById(_id);   

  if (!user) {
    res.status(500);
    throw new Error('Failed to find user');
  }

  if (user.refreshToken === refreshToken) {
    const newAccessToken = generateToken('access', _id);
    res.status(201).json({accessToken: newAccessToken});
  } else {
    res.status(400);
    throw new Error('Invalid refresh request');
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
  getNewAccessToken,
  getUserProfile,
  getAllUsers,
  editUserProfile,
  deleteUserProfile,
  hideUserProfile,
  unhideUserProfile
};