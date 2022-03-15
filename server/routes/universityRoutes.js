const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createUniversity } = require('../controllers/universityController');

router.post('/', protect, createUniversity);

module.exports = router;