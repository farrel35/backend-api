const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Route untuk menampilkan semua kategori
router.get('/', categoryController.getAllCategory);

// Route untuk menampilkan detail kategori berdasarkan ID
router.get('/:id', categoryController.getSingleCategory);

module.exports = router;
