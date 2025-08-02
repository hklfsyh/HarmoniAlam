// src/routes/article.routes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAuthenticated, verifyAuthorOrAdmin, verifyAdmin } = require('../middleware/auth.middleware');
const { 
    createArticle, 
    updateArticle, 
    deleteArticle,
    getPublicArticles,
    getAllArticles,
    getMyArticles,
    getArticleById,
    getLatestArticles // <-- Tambahkan import baru
} = require('../controllers/article.controller');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 }, // Gambar utama
    { name: 'gallery', maxCount: 10 } // Maksimal 10 gambar galeri
]);

// --- Rute GET ---
router.get('/', getPublicArticles);
router.get('/latest', getLatestArticles); // <-- Rute baru untuk 3 artikel terbaru
router.get('/all', verifyAdmin, getAllArticles);
router.get('/my-articles', verifyAuthenticated, getMyArticles); 
router.get('/:id', getArticleById);

// --- Rute POST, PATCH, DELETE ---
router.post('/', verifyAuthenticated, uploadFields, createArticle);
router.patch('/:id', verifyAuthenticated, verifyAuthorOrAdmin, uploadFields, updateArticle);
router.delete('/:id', verifyAuthenticated, verifyAuthorOrAdmin, deleteArticle);

module.exports = router;
