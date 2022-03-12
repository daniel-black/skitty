const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  editUserProfile,
  deleteUserProfile
 } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.put('/edit/:id', editUserProfile);
router.delete('/delete/:id', deleteUserProfile);

module.exports = router;

// router.post('/', (req, res) => {
//   res.json({m: 'register user'});
// });

// router.post('/login', (req, res) => {
//   res.json({m: 'login user'});
// });

// router.get('/profile', (req, res) => {
//   res.json({m: 'get user profile'});
// });

// router.put('/edit/:id', (req, res) => {
//   res.json({m: `edit user profile ${req.params.id}`});
// });

// router.delete('/delete/:id', (req, res) => {
//   res.json({m: `delete user ${req.params.id}`});
// })