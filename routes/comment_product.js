const express = require('express');
const router = express.Router();
const comment_productController = require('../controller/comment_productController');
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi
router.use(authMiddleware);

// Rute untuk menambahkan komentar
router.post('/', comment_productController.addComment);

module.exports = router;
