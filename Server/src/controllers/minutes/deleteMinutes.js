const db = require("../../db/config");

const deleteMinutes = (req, res) => {
  const { id } = req.body;

  const query = `DELETE FROM minutes WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      res.status(500).json({ message: "Error deleting minutes" });
    } else {
      res.status(200).json({ message: "Minutes deleted" });
    }
  });
};

module.exports = { deleteMinutes };
