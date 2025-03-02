const db = require("../../db/config");
const bcrypt = require("bcrypt");

const fetchLogin = (req, res) => {
  const query = `SELECT * FROM login`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching location" });
    }
    res.json({data: results});
  });
};

const addLogin = async(req, res) => {
  const {name, email, role} = req.body;
  const query = `INSERT INTO login (NAME, EMAIL, PASSWORD, ROLE) VALUES (?, ?, ?, ?)`
  const password = 'bitsathy';
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(query, [name, email, hashedPassword, role], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error adding location" });
      }
      res.status(200).json({ message: "Location added successfully" });
  });
}

const deleteData = (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM login WHERE ID = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting data" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
};

const updateData = (req, res) => {
  const {id, status} = req.body;
  const query = `UPDATE login SET STATUS = ? WHERE ID = ?`;

  db.query(query, [status, id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error deleting data" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
}

module.exports = { fetchLogin, addLogin, deleteData, updateData };
