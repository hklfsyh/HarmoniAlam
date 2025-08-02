// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth.middleware');
const { 
    registerAdmin, 
    loginAdmin,
    getDashboardStats,
    sendEmailToUser,
    deleteUserAccount,
    sendBroadcast 
} = require('../controllers/admin.controller');

// Rute otentikasi dan statistik
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/stats', verifyAdmin, getDashboardStats);

// Rute untuk mengirim email
router.post('/send-email', verifyAdmin, sendEmailToUser);
router.post('/broadcast', verifyAdmin, sendBroadcast);

// Rute baru untuk menghapus akun pengguna
router.delete('/users/:userType/:id', verifyAdmin, deleteUserAccount);

module.exports = router;
