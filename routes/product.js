const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

// Route untuk menampilkan semua produk
router.get("/", productController.getAllProduct);
router.get("/image/:id_product", productController.getProductImage);

router.get("/:id_product", productController.getSingleProduct);

// Route untuk menampilkan produk berdasarkan kategori
router.get("/category/:category_name", productController.getProductsByCategory);

module.exports = router;
