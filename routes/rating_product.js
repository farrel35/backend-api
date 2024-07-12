const express = require("express");
const router = express.Router();
const rating_productController = require("../controller/rating_productController");
const authMiddleware = require('../middleware/auth');

// Middleware untuk autentikasi
router.use(authMiddleware);
// Endpoint untuk menambahkan rating produk
router.post("/", rating_productController.addRating);

module.exports = router;
