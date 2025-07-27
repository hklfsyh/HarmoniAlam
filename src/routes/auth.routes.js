// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { verifyEmail, forgotPassword, resetPassword } = require('../controllers/auth.controller');

// Rute verifikasi email
router.get('/verify', verifyEmail);

// Rute baru untuk reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
