const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth.middleware');
const { 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getAllCategories,
    getEventCategories,   
    getArticleCategories  
} = require('../controllers/category.controller');

// --- Rute Admin ---
router.post('/', verifyAdmin, createCategory);
router.patch('/:id', verifyAdmin, updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

// --- Rute Publik ---
router.get('/', getAllCategories); // Mendapatkan semua kategori (campuran)
router.get('/events', getEventCategories); // <-- Rute baru hanya untuk event
router.get('/articles', getArticleCategories); // <-- Rute baru hanya untuk artikel

module.exports = router;