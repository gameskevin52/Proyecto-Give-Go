require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "give",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("No se pudo conectar a MySQL: ", err.code);
    return;
  }

  console.log("Base de datos conectada");
  connection.release();
});

module.exports = db;
