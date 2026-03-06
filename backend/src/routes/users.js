const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, verifyUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/verify', protect, verifyUser);

module.exports = router;
