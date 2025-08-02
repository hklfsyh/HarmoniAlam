const express = require('express');
const router = express.Router();
const { verifyOrganizer, verifyAdmin, verifyOrganizerProfileAccess } = require('../middleware/auth.middleware');
const multer = require('multer');
const { registerOrganizer, loginOrganizer, updateOrganizerStatus, getAllOrganizers, getOrganizerById, getMyProfile, updateMyProfile, getOrganizerSubmissions, getOrganizerStats, getPublicOrganizerProfile   } = require('../controllers/organizer.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/register', upload.single('document'), registerOrganizer);
router.post('/login', loginOrganizer);

// RUTE BARU: Menggantikan rute approve yang lama
router.get('/stats', verifyOrganizer, getOrganizerStats);
router.get('/profile', verifyOrganizerProfileAccess, getMyProfile);
router.patch('/profile', verifyOrganizerProfileAccess, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), updateMyProfile)

//admin
router.get('/submissions', verifyAdmin, getOrganizerSubmissions);
router.patch('/:id/status', verifyAdmin, updateOrganizerStatus);
router.get('/', verifyAdmin, getAllOrganizers);
router.get('/:id', verifyAdmin, getOrganizerById);

router.get('/:id/public', getPublicOrganizerProfile);

module.exports = router;