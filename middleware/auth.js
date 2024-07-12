const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../library/database');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const [user] = await db.query('SELECT * FROM tbl_users WHERE id_user = ?', [decoded.id_user]);
    if (!user.length) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id_user: user[0].id_user,
      name: user[0].name,
      email: user[0].email,
      role: user[0].role
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: `Invalid token: ${error.message}` });
  }
};




module.exports = verifyToken;

