const express = require('express');
const router = express.Router();
const { getPotentialMatches, actionOnMatch, getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/potential', protect, getPotentialMatches);
router.post('/action', protect, actionOnMatch);
router.get('/', protect, getMatches);

module.exports = router;
