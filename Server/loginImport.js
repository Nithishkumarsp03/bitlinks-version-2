const XLSX = require("xlsx");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

// Step 1: Read Excel File
const workbook = XLSX.readFile("login.xlsx"); // replace with your Excel file path
const sheetName = workbook.SheetNames[0];
const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Step 2: Connect to MySQL
const pool = mysql.createPool({
  host: "10.30.10.21",
  user: "nithish",
  password: "Qwertyuiop@2005",
  database: "bitlinks",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function insertData() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 3: Hash the password once
    const plainPassword = "bitlinks001";
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 salt rounds

    // Prepare values with hashed password
    const values = worksheet.map((row) => [
      row["Mail ID"],
      row["Name"],
      "intern",
      hashedPassword
    ]);

    // Bulk Insert
    await connection.query(`INSERT INTO login (EMAIL, NAME, ROLE, PASSWORD) VALUES ?`, [
      values,
    ]);

    await connection.commit();
    console.log("Data inserted successfully!");
  } catch (err) {
    await connection.rollback();
    console.error("Error inserting data:", err);
  } finally {
    connection.release();
    pool.end();
  }
}

insertData();
