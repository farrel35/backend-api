const db = require("../library/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  const sql = "SELECT * FROM tbl_users";
  try {
    const [rows] = await db.query(sql);
    res.json({
      payload: rows,
      message: "Success GET all users",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  const { id_user } = req.body;
  const sql = "DELETE FROM tbl_users WHERE id_user = ?";
  try {
    const [result] = await db.query(sql, [id_user]);
    if (result.affectedRows) {
      res.json({
        payload: { isSuccess: result.affectedRows },
        message: "Success Delete User",
      });
    } else {
      res.status(404).json({
        message: "User Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  const { id_user, role } = req.body;
  const sql = "UPDATE tbl_users SET role = ? WHERE id_user = ?";
  try {
    const [result] = await db.query(sql, [role, id_user]);
    if (result.affectedRows) {
      res.json({
        payload: { isSuccess: result.affectedRows },
        message: "Success Update User Role",
      });
    } else {
      res.status(404).json({
        message: "User Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  const sql = "SELECT * FROM tbl_products";
  try {
    const [rows] = await db.query(sql);
    res.json({
      payload: rows,
      message: "Success GET all products",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const getProductImage = async (req, res) => {
  const { id_product } = req.params;
  try {
    const sql = "SELECT * FROM tbl_image_products WHERE id_product = ?";
    const [rows, fields] = await db.query(sql, [id_product]);
    res.json({
      payload: rows,
      message: "Success Show Image Product!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const deleteProductImage = async (req, res) => {
  const { id_image } = req.body;
  try {
    const sql = "DELETE FROM tbl_image_products WHERE id_image = ?";
    const [result] = await db.query(sql, [id_image]);
    res.json({
      payload: {
        isSuccess: result.affectedRows,
        message: result.message,
      },
      message: "Success Delete Data",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const addProductImage = async (req, res) => {
  try {
    const { id_product, keterangan } = req.body;
    let image;

    if (req.file) {
      // If a file is uploaded, store its relative path
      image = `/image/${req.file.filename}`;
    } else {
      throw new Error("No file uploaded");
    }

    console.log("Parsed request data:", {
      id_product,
      keterangan,
      image,
    });

    const sql =
      "INSERT INTO tbl_image_products (id_product, keterangan, image) VALUES (?, ?, ?)";
    const values = [id_product, keterangan, image];

    const [result] = await db.query(sql, values);

    console.log("Database insert successful:", result);

    res.json({
      payload: {
        isSuccess: result.affectedRows > 0,
        id: result.insertId,
      },
      message: "Product added!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err.message,
    });
  }
};
// Create product
const createProduct = async (req, res) => {
  try {
    const { product_name, description, price, stock, id_category } = req.body;
    let image = req.file; // Default to empty string

    if (req.file) {
      // Jika ada file yang diunggah
      image = `/image/${req.file.filename}`; // Store the relative path with extension
    } else {
      const ext = path.extname(req.file.originalname); // Ambil ekstensi file dari originalname
      // Jika tidak ada file yang diunggah
      image = `/image/default${ext}`; // Atau gunakan nilai default
    }

    console.log("Parsed request data:", {
      product_name,
      description,
      price,
      stock,
      id_category,
      image,
    });

    // Pastikan req.file tidak kosong
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const sql =
      "INSERT INTO tbl_products (product_name, description, price, stock, image, id_category) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      product_name,
      description,
      price,
      stock,
      image,
      id_category,
    ];

    const [result] = await db.query(sql, values);

    console.log("Database insert successful:", result);

    res.json({
      payload: {
        isSuccess: result.affectedRows > 0,
        id: result.insertId,
      },
      message: "Product added!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id_product, product_name, description, price, stock, id_category } =
    req.body;
  // let image = req.file.originalname;

  try {
    // Validasi data input
    if (!id_product) {
      return res.status(400).json({
        message: "Please provide id_product",
      });
    }

    // Dapatkan detail produk yang akan diperbarui dari database
    const [fetchResult] = await db.query(
      "SELECT * FROM tbl_products WHERE id_product = ?",
      [id_product]
    );

    if (!fetchResult.length) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    // Ambil nilai yang ada jika tidak ada perubahan di request body
    const newName =
      product_name !== undefined ? product_name : fetchResult[0].product_name;
    const newDesc =
      description !== undefined ? description : fetchResult[0].description;
    const newPrice = price !== undefined ? price : fetchResult[0].price;
    const newStock = stock !== undefined ? stock : fetchResult[0].stock;

    // Jika tidak ada file yang diunggah, gunakan image yang ada di database
    if (!req.file) {
      image = fetchResult[0].image;
    } else {
      image = `/image/${req.file.filename}`;
      // Hapus gambar lama jika ada
      const oldImagePath = path.join(__dirname, "..", fetchResult[0].image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Query untuk melakukan update
    const updateSql =
      "UPDATE tbl_products SET product_name = ?, description = ?, price = ?, stock = ?, image = ?, id_category = ? WHERE id_product = ?";
    const [result] = await db.query(updateSql, [
      newName !== undefined ? newName : fetchResult[0].product_name,
      newDesc !== undefined ? newDesc : fetchResult[0].description,
      newPrice !== undefined ? newPrice : fetchResult[0].price,
      newStock !== undefined ? newStock : fetchResult[0].stock,
      image !== undefined ? image : fetchResult[0].image,
      id_category !== undefined ? id_category : fetchResult[0].id_category,
      id_product,
    ]);

    if (result.affectedRows) {
      // Kirim respons JSON jika berhasil melakukan update
      res.json({
        payload: { isSuccess: result.affectedRows },
        message: "Success Update Product",
      });
    } else {
      // Kirim respons JSON jika produk tidak ditemukan
      res.status(404).json({
        message: "Product Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    // Kirim respons JSON jika terjadi kesalahan server
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id_product } = req.body;
  try {
    const sql = "DELETE FROM tbl_products WHERE id_product = ?";
    const [result] = await db.query(sql, [id_product]);
    res.json({
      payload: {
        isSuccess: result.affectedRows,
        message: result.message,
      },
      message: "Success Delete Data",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Get All category
const getAllCategories = async (req, res) => {
  const sql = "SELECT * FROM tbl_categorys";
  try {
    const [rows] = await db.query(sql);
    res.json({
      payload: rows,
      message: "Success GET all categories",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { category_name, categorys } = req.body;
    let image = req.file; // Default to empty string

    if (req.file) {
      // Jika ada file yang diunggah
      image = `/image/${req.file.filename}`; // Store the relative path with extension
    } else {
      const ext = path.extname(req.file.originalname); // Ambil ekstensi file dari originalname
      // Jika tidak ada file yang diunggah
      image = `/image/default${ext}`; // Atau gunakan nilai default
    }

    console.log("Parsed request data:", {
      category_name,
      categorys,
      image,
    });

    // Pastikan req.file tidak kosong
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const sql =
      "INSERT INTO tbl_categorys (category_name, categorys, image) VALUES (?, ?, ?)";
    const values = [category_name, categorys, image];

    const [result] = await db.query(sql, values);

    console.log("Database insert successful:", result);

    res.json({
      payload: {
        isSuccess: result.affectedRows > 0,
        id: result.insertId,
      },
      message: "Category added!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err.message,
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  const { id_category, category_name, categorys } = req.body;
  // let image = req.file.originalname;

  try {
    // Validasi data input
    if (!id_category) {
      return res.status(400).json({
        message: "Please provide id_category",
      });
    }

    // Dapatkan detail category yang akan diperbarui dari database
    const [fetchResult] = await db.query(
      "SELECT * FROM tbl_categorys WHERE id_category = ?",
      [id_category]
    );

    if (!fetchResult.length) {
      return res.status(404).json({
        message: "Category Not Found",
      });
    }

    // Ambil nilai yang ada jika tidak ada perubahan di request body
    const newName =
      category_name !== undefined
        ? category_name
        : fetchResult[0].category_name;
    const newCategorys =
      categorys !== undefined ? categorys : fetchResult[0].categorys;

    // Jika tidak ada file yang diunggah, gunakan image yang ada di database
    if (!req.file) {
      image = fetchResult[0].image;
    } else {
      // Hapus gambar lama jika ada
      image = `/image/${req.file.filename}`;
      const oldImagePath = path.join(
        __dirname,
        "..",
        "image",
        fetchResult[0].image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    // Query untuk melakukan update
    const updateSql =
      "UPDATE tbl_categorys SET category_name = ?, categorys = ?, image = ? WHERE id_category = ?";
    const [result] = await db.query(updateSql, [
      newName !== undefined ? newName : fetchResult[0].category_name,
      newCategorys !== undefined ? newCategorys : fetchResult[0].categorys,
      image !== undefined ? image : fetchResult[0].image,
      id_category,
    ]);

    if (result.affectedRows) {
      // Kirim respons JSON jika berhasil melakukan update
      res.json({
        payload: { isSuccess: result.affectedRows },
        message: "Success Update Category",
      });
    } else {
      // Kirim respons JSON jika kategori tidak ditemukan
      res.status(404).json({
        message: "Category Not Found",
      });
    }
  } catch (err) {
    console.error(err);
    // Kirim respons JSON jika terjadi kesalahan server
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err.message,
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  const { id_category } = req.body;
  try {
    const sql = "DELETE FROM tbl_categorys WHERE id_category = ?";
    const [result] = await db.query(sql, [id_category]);

    if (result.affectedRows) {
      res.json({
        payload: { isSuccess: result.affectedRows },
        message: "Success Delete Category",
      });
    } else {
      res.status(404).json({
        message: "Category Not Found",
      });
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Create transaction history
const createTransactionHistory = async (orderDetails) => {
  const { id_order, id_user, total_amount, transaction_date } = orderDetails;
  const sql =
    "INSERT INTO transaction_historys (id_order, id_user, total_amount, transaction_date) VALUES (?, ?, ?, ?)";
  const values = [id_order, id_user, total_amount, transaction_date];
  try {
    const [result] = await db.query(sql, values);
    return result.insertId; // Return the inserted id if needed
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

// Get transaction history (Admin only)
const getTransactionHistory = async () => {
  const sql = `SELECT th.*, op.id_product, p.product_name, p.price
               FROM transaction_historys th
               JOIN order_product op ON th.id_order = op.id_order
               JOIN tbl_products p ON op.id_product = p.id_product`;
  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

// Update transaction history (if needed)
const updateTransactionHistory = async (id_order, updatedDetails) => {
  const fields = [];
  const values = [];

  // Iterate over the updatedDetails object to construct the SQL query
  for (const [key, value] of Object.entries(updatedDetails)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  // Join fields with commas to create the SET part of the query
  const setClause = fields.join(", ");
  values.push(id_order); // Add id_order to the values array for the WHERE clause

  const sql = `UPDATE transaction_historys SET ${setClause} WHERE id_order = ?`;

  try {
    const [result] = await db.query(sql, values);
    return result.affectedRows > 0; // Return true if the update was successful
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

// Delete transaction history
const deleteTransactionHistory = async (id_order) => {
  const sql = "DELETE FROM transaction_historys WHERE id_order = ?";
  try {
    const [result] = await db.query(sql, [id_order]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

const getOrder = async (req, res) => {
  try {
    const sql =
      "SELECT * FROM tbl_transaction ORDER BY status_bayar DESC, order_date ASC";
    const [rows, fields] = await db.query(sql);
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

const updateStatusOrder = async (req, res) => {
  const { no_order } = req.params;
  const { status_order, no_resi } = req.body;

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

    const sql = `UPDATE tbl_transaction SET status_order = ?, no_resi = ? WHERE no_order = ?`;
    await db.query(sql, [status_order, no_resi, no_order]);

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
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllProducts,
  getProductImage,
  deleteProductImage,
  addProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTransactionHistory,
  createTransactionHistory,
  updateTransactionHistory,
  deleteTransactionHistory,
  getOrder,
  getDetailOrder,
  updateStatusOrder,
};
