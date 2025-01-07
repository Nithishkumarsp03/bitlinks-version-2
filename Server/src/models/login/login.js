const mysql = require("mysql2");
const db = require("../../db/config"); // Your database configuration

// Function to get a user by email
const getUserByEmail = (email, callback) => {
  const query = "SELECT * FROM login WHERE EMAIL = ?";
  db.execute(query, [email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]); // Return first user if exists
  });
};

module.exports = {
  getUserByEmail,
};
