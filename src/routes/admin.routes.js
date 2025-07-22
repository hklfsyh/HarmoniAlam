const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth.middleware'); // <-- Pastikan verifyAdmin diimpor
const { registerAdmin, loginAdmin, getDashboardStats  } = require('../controllers/admin.controller');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/stats', verifyAdmin, getDashboardStats);

module.exports = router;