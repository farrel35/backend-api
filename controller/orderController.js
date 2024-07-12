const db = require("../library/database");

const generateOrderNumber = () => {
  const generateRandomString = (length, characters) => {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const alphaPart = generateRandomString(5, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  const numericPart = generateRandomString(4, "0123456789");
  return `MF-${alphaPart}${numericPart}`;
};

const orderProduct = async (req, res) => {
  try {
    const {
      cartItems,
      nama_penerima,
      tlp_penerima,
      alamat_penerima,
      ongkir,
      grand_total,
      total_bayar,
    } = req.body;
    const id_user = req.user.id_user;

    const no_order = generateOrderNumber();

    for (let item of cartItems) {
      const { id_product, quantity } = item;
      // Fetch product details from database
      const [products] = await db.query(
        "SELECT * FROM tbl_products WHERE id_product = ?",
        [id_product]
      );
      const product = products[0];
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      // Check if there's enough stock
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      // Calculate new stock after purchase
      const newStock = product.stock - quantity;
      // Update product stock in the database
      await db.query("UPDATE tbl_products SET stock = ? WHERE id_product = ?", [
        newStock,
        id_product,
      ]);
      // Insert order details into tbl_orders
      const sql =
        "INSERT INTO tbl_detail_transaction (no_order, id_product, quantity) VALUES (?, ?, ?)";
      await db.query(sql, [no_order, id_product, quantity]);
    }

    const sql =
      "INSERT INTO tbl_transaction (id_user, no_order, nama_penerima, tlp_penerima, alamat_penerima, ongkir, grand_total, total_bayar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await db.query(sql, [
      id_user,
      no_order,
      nama_penerima,
      tlp_penerima,
      alamat_penerima,
      ongkir,
      grand_total,
      total_bayar,
    ]);

    return res.json({
      message: "Order Berhasil",
    });
  } catch (error) {
    console.error("Error adding to order:", error.message);
    res.status(500).send("Server error");
  }
};

const getOrder = async (req, res) => {
  const id_user = req.user.id_user;

  try {
    const sql =
      "SELECT * FROM tbl_transaction WHERE id_user = ? ORDER BY status_bayar DESC, order_date ASC";
    const [rows, fields] = await db.query(sql, [id_user]);
    res.json({
      payload: rows,
      message: "Success Show Transaction!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const getDetailOrder = async (req, res) => {
  const { no_order } = req.params;

  try {
    const sql = ` SELECT dt.*, p.product_name, p.price, p.image FROM tbl_detail_transaction dt JOIN tbl_products p ON dt.id_product = p.id_product WHERE dt.no_order = ? `;
    const [rows, fields] = await db.query(sql, [no_order]);
    res.json({
      payload: rows,
      message: "Success Show Detail Transaction!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const updateStatusBayar = async (req, res) => {
  const { no_order } = req.params;
  const { nama_bank, atas_nama, no_rekening } = req.body;

  let image = null;

  try {
    // Pastikan item keranjang ada sebelum diupdate
    const [orderItem] = await db.query(
      `SELECT * FROM tbl_transaction WHERE no_order = ?`,
      [no_order]
    );

    if (!orderItem) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (req.file) {
      image = `/image/${req.file.filename}`; // Gunakan path relatif dengan nama file yang diunggah
    }

    // Update jumlah barang di keranjang
    const sql = `UPDATE tbl_transaction SET status_bayar = 1, image_bayar = ?, atas_nama = ?, nama_bank = ?, no_rekening = ? WHERE no_order = ?`;
    await db.query(sql, [image, atas_nama, nama_bank, no_rekening, no_order]);

    const [updatedOrderItem] = await db.query(
      `SELECT * FROM tbl_transaction WHERE no_order = ?`,
      [no_order]
    );

    res.status(200).json({
      success: true,
      message: "Status order berhasil diperbarui",
      updatedOrder: updatedOrderItem,
    });
  } catch (error) {
    console.error("Error updating status bayar:", error.message);
    res.status(500).send("Server error");
  }
};

const updateStatusDiterima = async (req, res) => {
  const { no_order } = req.params;

  try {
    const [orderItem] = await db.query(
      `SELECT * FROM tbl_transaction WHERE no_order = ?`,
      [no_order]
    );

    if (!orderItem) {
      return res
        .status(404)
        .json({ success: false, message: "Order tidak ditemukan" });
    }

    const sql = `UPDATE tbl_transaction SET status_order = 3 WHERE no_order = ?`;
    await db.query(sql, [no_order]);

    const [updatedOrderItem] = await db.query(
      `SELECT * FROM tbl_transaction WHERE no_order = ?`,
      [no_order]
    );

    res.status(200).json({
      success: true,
      message: "Status order berhasil diperbarui",
      updatedOrder: updatedOrderItem,
    });
  } catch (error) {
    console.error("Error updating status order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  orderProduct,
  getOrder,
  getDetailOrder,
  updateStatusBayar,
  updateStatusDiterima,
};
