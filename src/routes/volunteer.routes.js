const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAdmin, verifyVolunteer } = require('../middleware/auth.middleware');
const { registerVolunteer, loginVolunteer, getAllVolunteers, getVolunteerById, getMyProfile, updateMyProfile,getMyRegistrations   } = require('../controllers/volunteer.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/register', registerVolunteer);
router.post('/login', loginVolunteer);
router.get('/profile', verifyVolunteer, getMyProfile);
router.patch('/profile', verifyVolunteer, upload.single('image'), updateMyProfile);
router.get('/my-registrations', verifyVolunteer, getMyRegistrations);

// Rute GET (hanya untuk Admin)
router.get('/', verifyAdmin, getAllVolunteers);
router.get('/:id', verifyAdmin, getVolunteerById);


module.exports = router;