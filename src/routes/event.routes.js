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

// Impor semua fungsi controller yang diperlukan
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
    getMyRegisteredEvents,
    getLatestEvents // <-- Tambahkan import baru
} = require('../controllers/event.controller');

// Konfigurasi Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// --- Rute GET ---
router.get('/', getPublicEvents);
router.get('/latest', getLatestEvents); // <-- Rute baru untuk 3 event terbaru
router.get('/all', verifyAdmin, getAllEventsForAdmin);
router.get('/my-events', verifyOrganizer, getMyEvents);
router.get('/stats', verifyOrganizer, getEventStats);
router.get('/my-registered-events', verifyVolunteer, getMyRegisteredEvents); // Rute untuk volunteer

// Rute dengan parameter diletakkan setelah rute spesifik
router.get('/:id', getEventById);

// PERBAIKAN DI SINI: Tambahkan verifyAuthenticated sebelum verifyEventOwner
router.get('/:id/volunteers', verifyAuthenticated, verifyEventOwner, getEventVolunteers);

// --- Rute Manajemen Event (POST, PATCH, DELETE) ---
router.post('/', verifyOrganizer, upload.single('image'), createEvent);

// PERBAIKAN DI SINI: Tambahkan verifyAuthenticated sebelum verifyEventOwner
router.patch('/:id', verifyAuthenticated, verifyEventOwner, upload.single('image'), updateEvent); 
router.delete('/:id', verifyAuthenticated, verifyEventOwner, deleteEvent);

// --- Rute Partisipasi Volunteer ---
router.post('/:id/register', verifyVolunteer, registerForEvent);
router.delete('/:id/register', verifyVolunteer, cancelRegistration);

module.exports = router;
