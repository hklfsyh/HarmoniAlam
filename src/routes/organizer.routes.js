const express = require('express');
const router = express.Router();
const { verifyOrganizer, verifyAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');
const { registerOrganizer, loginOrganizer, updateOrganizerStatus, getAllOrganizers, getOrganizerById, getMyProfile, updateMyProfile   } = require('../controllers/organizer.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/register', upload.single('document'), registerOrganizer);
router.post('/login', loginOrganizer);

// RUTE BARU: Menggantikan rute approve yang lama
// URL menjadi /api/organizer/:id/status
router.patch('/:id/status', verifyAdmin, updateOrganizerStatus);
router.get('/', verifyAdmin, getAllOrganizers);
router.get('/:id', verifyAdmin, getOrganizerById);
router.get('/profile', verifyOrganizer, getMyProfile);
router.patch('/profile', verifyOrganizer, upload.single('image'), updateMyProfile);

module.exports = router;