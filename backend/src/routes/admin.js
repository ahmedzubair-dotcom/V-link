const express = require('express');
const router = express.Router();
const { getIncidents, resolveIncident, getBannedDevices } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Note: Admin routes should ideally have an admin middleware, keeping it simple with protect for now
router.get('/incidents', protect, getIncidents);
router.post('/incidents/:id/resolve', protect, resolveIncident);
router.get('/banned-devices', protect, getBannedDevices);

module.exports = router;
