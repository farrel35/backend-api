const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const db = require("../library/database");

const secretKey =
  process.env.JWT_SECRET ; // Pastikan ini benar

const generateToken = (user) => {
  const token = jwt.sign({ id_user: user.id_user, username: user.name }, secretKey, { expiresIn: '1h' });
  return token;
};

// Function to generate JWT token
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);
  
    try {
      const sql = `SELECT id_user, email, password, role FROM tbl_users WHERE LOWER(email) = LOWER(?)`;
      const [rows, fields] = await db.query(sql, [email]);
  
      if (rows.length === 0) {
        console.log(`User '${email}' not found`);
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      const user = rows[0];
      const result = await bcrypt.compare(password, user.password);
  
      if (!result) {
        console.log(`Password does not match for user '${email}'`);
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
  
      const token = generateToken(user);
      let redirectUrl = '/home'; // Default redirect URL for users
      if (user.role === 'admin') {
        redirectUrl = '/admin'; // Redirect admin to different route
      }
      res.json({
        token: token,
        redirectUrl: redirectUrl,
        message: "Login successful",
      });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({
        message: "Internal Server Error",
        serverMessage: err,
      });
    }
  };
  

// Function for register
const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO tbl_users (username, email, password, role) VALUES (?, ?, ?, 'user')`;
      const result = await db.query(sql, [username, email, hashedPassword, role]);
      res.json({
          message: "Registration successful",
      });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

const logout = async (req, res) => {
  res.json({
    message: "Logout successful"
  })
}

// Function to get all users
const getAllUsers = async (req, res) => {
  const sql = "SELECT * FROM tbl_users";
  try {
    const [rows, fields] = await db.query(sql);
    res.json({
      payload: rows,
      message: "Success GET data",
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({
      message: "Internal Server Error",
      serverMessage: err,
    });
  }
};

// Function to get a single user by ID
const getSingleUser = async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM tbl_users WHERE id_user = ?`;
    try {
        const [rows, fields] = await db.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.json({
            payload: rows[0],
            message: "Success Get Single User!",
        });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({
            message: "Internal Server Error",
            serverMessage: err,
        });
    }
};

module.exports = {
    login,
    register,
    logout,
    getAllUsers,
    getSingleUser,
};
