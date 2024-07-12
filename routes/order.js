const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image"); // Specify your upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  },
});
const upload = multer({ storage: storage });

router.use(authMiddleware);

router.post("/checkout", orderController.orderProduct);
router.get("/transaction", orderController.getOrder);
router.get("/transaction-detail/:no_order", orderController.getDetailOrder);

router.put(
  "/transaction-detail/edit/:no_order",
  upload.single("image"),
  orderController.updateStatusBayar
);

router.put(
  "/transaction-detail/edit-diterima/:no_order",
  orderController.updateStatusDiterima
);

module.exports = router;
