require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createPool({
   host: "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "give",
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
 if (err) {
  console.log("No se pudo conectar a MySQL:");
  console.log(err);
  return;
}

  console.log("Base de datos conectada");
  connection.release();
});

module.exports = db;
