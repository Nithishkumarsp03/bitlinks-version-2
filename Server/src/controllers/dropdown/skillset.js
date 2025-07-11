const db = require("../../db/config");

const fetchdata = (req, res) => {
  db.query(`SELECT skillset_column FROM skillset_table`, (err, results) => {
    if (err) {
      console.error("Fetching error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // console.log("Received data:", results);

    // Check if results is an array
    if (Array.isArray(results)) {
      if (results.length === 0) {
        return res.status(404).json({ message: "No skills found" });
      }
      // Send the data as an array
      res.status(200).json({ results });
    } else {
      console.log("Received data is not an array:", results); // Debugging log for non-array data
      res.status(500).json({ message: "Data is not in an array format" });
    }
  });
};

module.exports = { fetchdata };
