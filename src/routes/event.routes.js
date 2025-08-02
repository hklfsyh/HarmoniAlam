const express = require('express');
const router = express.Router();
const multer = require('multer');

// Impor semua middleware yang diperlukan
const { 
    verifyAuthenticated, 
    verifyOrganizer, 
    verifyAdmin, 
    verifyEventOwner, 
    verifyVolunteer 
} = require('../middleware/auth.middleware');

// Impor fungsi dari controller yang relevan
const { 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    getEventVolunteers, 
    getEventById,
    getPublicEvents,
    getMyEvents,
    getAllEventsForAdmin,
    registerForEvent,
    cancelRegistration,
    getEventStats,
    getLatestEvents,
    getMyRegisteredEvents
} = require('../controllers/event.controller');
const { emailVolunteers } = require('../controllers/communication.controller');

// Konfigurasi Multer untuk menangani upload file
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Konfigurasi untuk menerima gambar utama dan galeri
const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'gallery', maxCount: 10 } 
]);

// --- Rute GET ---
// Rute yang paling spesifik (tanpa parameter) diletakkan di atas
router.get('/', getPublicEvents);
router.get('/latest', getLatestEvents);
router.get('/all', verifyAdmin, getAllEventsForAdmin);
router.get('/my-events', verifyOrganizer, getMyEvents);
router.get('/stats', verifyOrganizer, getEventStats);
router.get('/my-registered-events', verifyVolunteer, getMyRegisteredEvents);

// Rute dengan parameter diletakkan di bawah rute spesifik
router.get('/:id', getEventById);
router.get('/:id/volunteers', verifyAuthenticated, verifyEventOwner, getEventVolunteers);

// --- Rute Manajemen & Komunikasi Event ---
router.post('/', verifyOrganizer, uploadFields, createEvent);
router.patch('/:id', verifyAuthenticated, verifyEventOwner, uploadFields, updateEvent); 
router.delete('/:id', verifyAuthenticated, verifyEventOwner, deleteEvent);
router.post('/:id/email-volunteers', verifyAuthenticated, verifyEventOwner, emailVolunteers); // Endpoint baru untuk email

// --- Rute Partisipasi Volunteer ---
router.post('/:id/register', verifyVolunteer, registerForEvent);
router.delete('/:id/register', verifyVolunteer, cancelRegistration);

module.exports = router;
