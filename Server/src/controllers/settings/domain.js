const db = require("../../db/config");

const fetchDomain = (req, res) => {
  const query = `SELECT * FROM domain_table`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching location" });
    }
    res.json({data: results});
  });
};

const addDomain = (req, res) => {
  const { value } = req.body;
  
  if (!value) {
    return res.status(400).json({ message: "Value is required" });
  }

  const query = `INSERT INTO domain_table (domain_column) VALUES (?)`;

  db.query(query, [value], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error adding domain", error: err });
    }

    res.status(200).json({ message: "Domain added successfully" });
  });
};

const deleteData = (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM domain_table WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting data" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
};

const updateData = (req, res) => {
  const {id, status} = req.body;
  const query = `UPDATE domain_table SET status = ? WHERE id = ?`;

  db.query(query, [status, id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting data" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
}

module.exports = { fetchDomain, addDomain, deleteData, updateData };
