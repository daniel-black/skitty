const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const {  
  loginUser,
  logoutUser,
  getAllUsers,
  registerUser, 
  getUserProfile,  
  editUserProfile,
  getNewAccessToken,
  deleteUserProfile,
  toggleProfileVisibility
 } = require('../controllers/userController');
  
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/refresh', getNewAccessToken);
router.patch('/logout', protect, logoutUser);
router.get('/allUsers', protect, getAllUsers);
router.get('/profile', protect, getUserProfile);
router.patch('/edit', protect, editUserProfile);
router.delete('/delete', protect, deleteUserProfile);
router.patch('/toggleHide', protect, toggleProfileVisibility);

module.exports = router;