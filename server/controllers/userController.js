const asyncHandler = require('express-async-handler');
const { generateToken, _idFromJWT, checkTokenValidity } = require('../utilities/jwt');
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
  // first check that email and password were received
  const { eduEmail, password } = req.body;
  if (!eduEmail || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // next, check if a user exists with that eduEmail
  const user = await User.findOne({ eduEmail });
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // next, check that passwords match
  const passwordsMatch = await bcrypt.compare(password, user.password); 
  if (!passwordsMatch) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const cookieRefreshToken = req.cookies.refreshToken || null;
  if (cookieRefreshToken === user.refreshToken && checkTokenValidity(user.refreshToken)) {
    res.redirect('refresh');
    return;
  }

  const accessToken = generateToken('access', user._id);
  const refreshToken = generateToken('refresh', user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200);
  res.clearCookie('refreshToken');
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    eduEmail: user.eduEmail,
    accessToken: accessToken
  });
});


const getNewAccessToken = asyncHandler(async (req, res) => {
  // might also want to thow a checkTokenValidity() on this too
  const refreshToken = req.cookies?.refreshToken;
  const validRefreshToken = checkTokenValidity(refreshToken);
  
  if (!validRefreshToken) {
    res.status(400);
    throw new Error('Invalid refresh token');
  }

  const _id = _idFromJWT(refreshToken);
  const user = await User.findById(_id);   

  if (!user) {
    res.status(500);
    throw new Error('Failed to find user');
  }

  if (user.refreshToken !== refreshToken) {
    res.status(400);
    throw new Error('Invalid refresh request');
  }

  const newAccessToken = generateToken('access', _id);
  res.status(201).json({accessToken: newAccessToken});
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
      res.status(400).json({ msg: 'failed to edit user' });
    }
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


const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(500);
    throw new Error('User not found');
  }
  user.refreshToken = '';
  await user.save();
  res.status(200).json({msg: `Logged out ${user.firstName}`});
});


const toggleProfileVisibility = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    res.status(500);
    throw new Error('User not found');
  }
  console.log(user);
  user.hidden = !user.hidden;
  await user.save();
  res.status(200).json(user);
});

module.exports = { 
  registerUser, 
  loginUser, 
  getNewAccessToken,
  getUserProfile,
  getAllUsers,
  editUserProfile,
  deleteUserProfile,
  toggleProfileVisibility,
  logoutUser
};