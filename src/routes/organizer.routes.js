const express = require('express');
const router = express.Router();
const { verifyOrganizer, verifyAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');
const { registerOrganizer, loginOrganizer, updateOrganizerStatus, getAllOrganizers, getOrganizerById, getMyProfile, updateMyProfile   } = require('../controllers/organizer.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/register', upload.single('document'), registerOrganizer);
router.post('/login', loginOrganizer);

// RUTE BARU: Menggantikan rute approve yang lama
router.get('/profile', verifyOrganizer, getMyProfile);
router.patch('/profile', verifyOrganizer, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), updateMyProfile);

//admin
router.patch('/:id/status', verifyAdmin, updateOrganizerStatus);
router.get('/', verifyAdmin, getAllOrganizers);
router.get('/:id', verifyAdmin, getOrganizerById);

module.exports = router;