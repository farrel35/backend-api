const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const authMiddleware = require('../middleware/auth'); // Middleware untuk verifikasi token JWT

// Gunakan middleware auth untuk memeriksa keaslian token
router.use(authMiddleware);

// Rute-rute yang sekarang langsung bisa diakses setelah verifikasi token
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.get('/:id_cart', cartController.getSingleCart);
router.put('/:id_cart', cartController.updateCart);
router.delete('/', cartController.deleteCart);
router.delete('/:id_cart', cartController.deleteCartItem);

module.exports = router;
