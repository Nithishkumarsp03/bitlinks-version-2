const mysql = require('mysql2/promise');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: '10.30.10.21',
  user: 'nithish',
  password: 'Qwertyuiop@2005',
  database: 'bitlinks',
};

async function fetchAndStoreData() {
  try {
    // Connect to the database
    const connection = await mysql.createConnection(dbConfig);

    // Fetch data from the database
    const query = `
      SELECT 
        p1.*, 
        COALESCE(p2.fullname, p1.fullname) AS sub_name, 
        company.*, 
        expertise.*, 
        pps.*, 
        (SELECT COUNT(*) FROM personalinfo WHERE sub_id = p1.person_id) AS connection_count 
      FROM personalinfo p1
      INNER JOIN company ON p1.person_id = company.person_id
      LEFT JOIN expertise ON p1.person_id = expertise.person_id
      LEFT JOIN personalinfo p2 ON p2.person_id = p1.sub_id
      LEFT JOIN person_points_summary pps ON pps.person_id = p1.person_id
      ORDER BY p1.person_id DESC
    `;
    const [rows] = await connection.execute(query);

    // Prepare data for Excel
    const headers = Object.keys(rows[0] || {}); // Column headers
    const data = rows.map(Object.values);      // Data rows

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheetData = [headers, ...data];  // Combine headers and data
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Save the Excel file
    const filePath = path.join(__dirname, 'data.xlsx');
    xlsx.writeFile(workbook, filePath);

    console.log(`Data successfully written to Excel file at ${filePath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchAndStoreData();
