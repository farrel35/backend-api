const db = require("../library/database");

const getAllProduct = async (req, res) => {
  try {
    const sql = "SELECT * FROM tbl_products";
    const [rows, fields] = await db.query(sql);
    res.json({
      payload: rows,
      message: "Success Show All Product!",
    });
  } catch (err) {
    console.error("Error executing query:", err);
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

const getProductsByCategory = async (req, res) => {
  const { category_name } = req.params;
  try {
    const sql = `
          SELECT p.*, c.id_category 
          FROM tbl_products p 
          JOIN tbl_categorys c ON p.id_category = c.id_category
          WHERE c.category_name = ?`;
    const [rows] = await db.query(sql, [category_name]);
    if (rows.length === 0) {
      return res.status(404).json({
        message: `No products found in category '${category_name}'`,
      });
    }
    res.json({
      payload: rows,
      message: `Products in category '${category_name}'`,
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const getSingleProduct = async (req, res) => {
  const { id_product } = req.params;
  try {
    const sql = `SELECT * FROM tbl_products WHERE id_product = ?`;
    const [rows, fields] = await db.query(sql, [id_product]);
    if (rows.length === 0) {
      return res.status(404).json({
        message: `Product with ID ${id_product} not found`,
      });
    }
    res.json({
      payload: rows[0],
      message: `Product details for ID ${id_product}`,
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

module.exports = {
  getAllProduct,
  getProductImage,
  getProductsByCategory,
  getSingleProduct,
};
