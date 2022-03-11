const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({m: 'register user'});
});

router.post('/login', (req, res) => {
  res.json({m: 'login user'});
});

router.get('/profile', (req, res) => {
  res.json({m: 'get user profile'});
});

router.put('/edit/:id', (req, res) => {
  res.json({m: `edit user profile ${req.params.id}`});
});

router.delete('/delete/:id', (req, res) => {
  res.json({m: `delete user ${req.params.id}`});
})

module.exports = router;