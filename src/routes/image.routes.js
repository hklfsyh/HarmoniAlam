// src/routes/image.routes.js
const express = require('express');
const router = express.Router();
const { verifyAuthenticated, verifyImageOwner } = require('../middleware/auth.middleware');
const { deleteImage } = require('../controllers/image.controller');

// Endpoint untuk menghapus satu gambar berdasarkan ID-nya
router.delete('/:id', verifyAuthenticated, verifyImageOwner, deleteImage);

module.exports = router;
