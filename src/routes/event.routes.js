const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAuthenticated, verifyOrganizer, verifyAdmin, verifyOrganizerOrAdmin, verifyVolunteer } = require('../middleware/auth.middleware');
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
    cancelRegistration
} = require('../controllers/event.controller');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// --- Rute GET ---
// Penting: Rute yang lebih spesifik harus diletakkan sebelum rute dengan parameter (:id)
router.get('/', getPublicEvents);                           // Publik
router.get('/all', verifyAdmin, getAllEventsForAdmin);       // Admin
router.get('/my-events', verifyOrganizer, getMyEvents);      // Organizer
router.get('/:id', getEventById);                            // Publik (detail)
router.get('/:id/volunteers', verifyAuthenticated, verifyOrganizerOrAdmin, getEventVolunteers); // Organizer/Admin (pemilik event)

// --- Rute POST, PATCH, DELETE ---
router.post('/', verifyOrganizer, upload.single('image'), createEvent);
router.patch('/:id', verifyOrganizer, upload.single('image'), updateEvent);
router.delete('/:id', verifyAuthenticated, verifyOrganizerOrAdmin, deleteEvent);
router.post('/:id/register', verifyVolunteer, registerForEvent);
router.delete('/:id/register', verifyVolunteer, cancelRegistration);

module.exports = router;