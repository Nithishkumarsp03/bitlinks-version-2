const db = require("../../db/config");

const fetchRole = (req, res) => {
  const query = `SELECT * FROM role_table`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching location" });
    }
    res.json({ data: results });
  });
};

const addRole = (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ message: "Value is required" });
  }

  const query = `INSERT INTO role_table (role_column) VALUES (?)`;

  db.query(query, [value], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error adding role", error: err });
    }

    res.status(200).json({ message: "Role added successfully" });
  });
};

const deleteData = (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM role_table WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting data" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
};

const updateData = (req, res) => {
  const {id, status} = req.body;
  const query = `UPDATE role_table SET status = ? WHERE id = ?`;

  db.query(query, [status, id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting data" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
}

module.exports = { fetchRole, addRole, deleteData , updateData};
