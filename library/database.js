const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "q78.h.filess.io",
  user: "mebel_barepoetif",
  password: "40e51090cc4719d5c883feebb220303d3893a98b",
  database: "mebel_barepoetif",
  port: "3307",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
