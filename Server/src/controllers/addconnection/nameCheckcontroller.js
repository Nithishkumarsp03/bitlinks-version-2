const db = require("../../db/config");

const nameCheck = (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
  
    // Fetch the name from the database
    const query = `SELECT fullname FROM personalinfo WHERE fullname = ? OR LOWER(fullname) = LOWER(?)`;
  
    db.query(query, [name, name], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      if (result.length > 0) {
        const storedName = result[0].fullname;
  
        // Check for exact match (case-sensitive)
        if (storedName === name) {
          return res.status(200).json({
            available: false,
            message: "Name is already taken (exact match)",
          });
        } else {
          return res.status(200).json({
            available: false,
            message: "Name is already taken but with different capitalization",
          });
        }
      }
  
      // Name does not exist
      return res.status(200).json({ available: true });
    });
  };
  
module.exports = { nameCheck };
  