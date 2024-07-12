const db = require("../library/database");

// Fungsi untuk menambahkan komentar produk
const addComment = async (req, res) => {
  const { id_product, comment } = req.body;
  const id_user = req.user.id_user; // Mengambil id_user dari req.user.id_user setelah middleware auth

  // Query SQL untuk menambahkan komentar ke dalam tabel
  const sql = `INSERT INTO tbl_comment_products (id_user, id_product, comment) VALUES (?, ?, ?)`;
  
  try {
    // Eksekusi query dengan menggunakan promise
    const [result] = await db.execute(sql, [id_user, id_product, comment]);

    // Mengembalikan respons ke client jika query berhasil
    res.json({
      payload: { id_comment: result.insertId },
      message: "Comment added successfully",
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
  addComment,
};
