const db = require("../library/database");
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

const getProfile = async (req, res) => {
  const id_user = req.user.id_user;

  try {
    const [results] = await db.execute(
      "SELECT id_user, username, email, password, image, no_hp, alamat, role FROM tbl_users WHERE id_user = ?",
      [id_user]
    );

    if (results.length === 0) {
      return res.status(404).json({ msg: "Profil tidak ditemukan" });
    }

    const user = results[0];
    res.json(user);
  } catch (error) {
    console.error("Error querying database:", error.stack);
    res.status(500).send("Server Error");
  }
};

const updateProfile = async (req, res) => {
  const { username, email, password, no_hp, alamat } = req.body;
  const id_user = req.user.id_user; // Ambil ID pengguna dari req.user atau sesuaikan dengan cara Anda

  try {
    // Dapatkan profil pengguna terbaru dari database
    const [currentUserData] = await db.execute(
      "SELECT username, email, password, no_hp, alamat, image FROM tbl_users WHERE id_user = ?",
      [id_user]
    );

    if (currentUserData.length === 0) {
      return res.status(404).json({ msg: "Profil tidak ditemukan" });
    }

    // Ambil data yang sekarang dari hasil query
    const currentUser = currentUserData[0];

    // Persiapkan nilai yang akan diupdate
    let updatedFields = {
      username: username || currentUser.username,
      email: email || currentUser.email,
      password: password || currentUser.password,
      no_hp: no_hp || currentUser.no_hp,
      alamat: alamat || currentUser.alamat,
      image: currentUser.image, // Gunakan gambar saat ini sebagai default
    };

    // Jika ada file gambar diunggah, update nilai image
    if (req.file) {
      updatedFields.image = `/image/${req.file.filename}`; // Gunakan path relatif dengan nama file yang diunggah
    }

    // Lakukan pembaruan hanya jika ada setidaknya satu nilai yang diubah
    const [results] = await db.execute(
      "UPDATE tbl_users SET username = ?, email = ?, password = ?, no_hp = ?, alamat = ? ,image = ? WHERE id_user = ?",
      [
        updatedFields.username,
        updatedFields.email,
        updatedFields.password,
        updatedFields.no_hp,
        updatedFields.alamat,
        updatedFields.image,
        id_user,
      ]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ msg: "Profil tidak ditemukan" });
    }

    res.json({ msg: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Error querying database:", error.stack);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
