const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12719771",
  password: "r4PPIv59ve",
  database: "sql12719771",
  port: "3306",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
