const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const authTokenLogout = (req, res, next) => {
  const auhtHeader = req.headers["authorization"];
  const token = auhtHeader && auhtHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authTokenLogout;
