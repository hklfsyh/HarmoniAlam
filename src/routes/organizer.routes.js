const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth.middleware');
const { registerOrganizer, loginOrganizer, updateOrganizerStatus } = require('../controllers/organizer.controller');

router.post('/register', registerOrganizer);
router.post('/login', loginOrganizer);

// RUTE BARU: Menggantikan rute approve yang lama
// URL menjadi /api/organizer/:id/status
router.patch('/:id/status', verifyAdmin, updateOrganizerStatus);

module.exports = router;