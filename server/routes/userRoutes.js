const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getNewAccessToken,
  getUserProfile,
  getAllUsers,
  editUserProfile,
  deleteUserProfile,
  toggleProfileVisibility,
  logoutUser
 } = require('../controllers/userController');

  
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/refresh', getNewAccessToken);
router.get('/profile', protect, getUserProfile);
router.get('/allUsers', protect, getAllUsers);
router.patch('/edit', protect, editUserProfile);
router.patch('/toggleHide', protect, toggleProfileVisibility);
router.patch('/logout', protect, logoutUser);
router.delete('/delete', protect, deleteUserProfile);


module.exports = router;
