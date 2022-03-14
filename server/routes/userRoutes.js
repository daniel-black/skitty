const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getAllUsers,
  editUserProfile,
  deleteUserProfile,
  hideUserProfile,
  unhideUserProfile
 } = require('../controllers/userController');

  
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/allUsers', protect, getAllUsers);
router.patch('/edit', protect, editUserProfile);
router.patch('/hide', protect, hideUserProfile);
router.patch('/unhide', protect, unhideUserProfile);
router.delete('/delete', protect, deleteUserProfile);


module.exports = router;
