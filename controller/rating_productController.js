const db = require("../library/database");

const addRating = async (req, res) => {
  const { id_product, rating } = req.body;
  const id_user = req.user.id_user; // Mengambil id_user dari req.user.id_user setelah middleware auth

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating value" });
  }

  // Query SQL untuk menambahkan rating ke dalam tabel
  const sql = `INSERT INTO tbl_rating_products (id_user, id_product, rating) VALUES (?, ?, ?)`;

  try {
    // Eksekusi query dengan menggunakan promise
    const [result] = await db.execute(sql, [id_user, id_product, rating]);

    // Mengembalikan respons ke client jika query berhasil
    res.json({
      payload: { id_rating: result.insertId },
      message: "Rating added successfully",
    });
  } catch (err) {
    // Menangani kesalahan jika query gagal
    console.error('Error querying database:', err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err.message, // Mengirim pesan kesalahan dari database
    });
  }
};

module.exports = {
  addRating,
};
