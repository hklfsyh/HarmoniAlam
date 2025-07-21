const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth.middleware');
const { 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getAllCategories 
} = require('../controllers/category.controller');

// Hanya ada satu rute POST sekarang
router.post('/', verifyAdmin, createCategory);

router.patch('/:id', verifyAdmin, updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);
router.get('/', getAllCategories);

module.exports = router;