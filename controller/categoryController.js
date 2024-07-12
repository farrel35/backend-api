const db = require("../library/database");

const getAllCategory = async (req, res) => {
  try {
    const sql = "SELECT * FROM tbl_categorys";
    const result = await db.query(sql);
    res.json({
      payload: result,
      message: "Success Show All Category!",
    });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const getSingleCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `SELECT * FROM tbl_categorys WHERE id_category = ?`;
    const rows = await db.query(sql, [id]);
    if (rows.length > 0) {
      res.json({
        payload: rows[0],
        message: "Success Get Single Category!",
      });
    } else {
      res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};



module.exports = {
  getAllCategory,
  getSingleCategory
};
