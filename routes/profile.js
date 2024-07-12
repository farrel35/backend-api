const express = require("express");
const router = express.Router();
const profileController = require("../controller/profileController");
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
// Rute untuk mendapatkan profil pengguna
router.get("/", profileController.getProfile);

// Rute untuk memperbarui profil pengguna
router.put("/edit", upload.single("image"), profileController.updateProfile);

module.exports = router;
