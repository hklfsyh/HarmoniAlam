// src/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const { verifyAuthenticated } = require('../middleware/auth.middleware');
const { submitContactForm } = require('../controllers/contact.controller');

// Endpoint ini bisa diakses oleh semua pengguna yang sudah login (Volunteer/Organizer)
router.post('/', verifyAuthenticated, submitContactForm);

module.exports = router;
