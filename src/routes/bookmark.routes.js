// src/routes/bookmark.routes.js
const express = require('express');
const router = express.Router();
const { verifyVolunteer } = require('../middleware/auth.middleware');
const { 
    toggleArticleBookmark, 
    toggleEventBookmark, 
    getMyBookmarks 
} = require('../controllers/bookmark.controller');

// Semua rute di sini hanya bisa diakses oleh volunteer yang sudah login
router.use(verifyVolunteer);

// Rute untuk mendapatkan semua bookmark milik volunteer
router.get('/', getMyBookmarks);

// Rute untuk menambah/menghapus bookmark (toggle)
// POST akan membuat bookmark jika belum ada
router.post('/articles/:id', toggleArticleBookmark);
router.post('/events/:id', toggleEventBookmark);

// DELETE akan menghapus bookmark jika sudah ada
router.delete('/articles/:id', toggleArticleBookmark);
router.delete('/events/:id', toggleEventBookmark);

module.exports = router;
