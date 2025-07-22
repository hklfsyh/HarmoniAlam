const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAuthenticated, verifyAuthorOrAdmin, verifyAdmin } = require('../middleware/auth.middleware');
const { 
    createArticle, 
    updateArticle, 
    deleteArticle,
    getAllArticles,
    getMyArticles,
    getArticleById,
    getPublicArticles
} = require('../controllers/article.controller');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// Rute GET
// Penting: Rute yang lebih spesifik seperti '/all' dan '/my-articles' harus diletakkan SEBELUM rute '/:id'
router.get('/', getPublicArticles);
router.get('/all', verifyAdmin, getAllArticles); // Admin melihat semua artikel
router.get('/my-articles', verifyAuthenticated, getMyArticles); // Pengguna melihat artikel miliknya
router.get('/:id', getArticleById); // Publik melihat detail satu artikel

// Rute POST, PATCH, DELETE
router.post('/', verifyAuthenticated, upload.single('image'), createArticle);
router.patch('/:id', verifyAuthenticated, verifyAuthorOrAdmin, upload.single('image'), updateArticle);
router.delete('/:id', verifyAuthenticated, verifyAuthorOrAdmin, deleteArticle);

module.exports = router;