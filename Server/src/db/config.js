const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to the MySQL database!");
    conn.release(); // Release the connection back to the pool
  }
});

module.exports = connection;
