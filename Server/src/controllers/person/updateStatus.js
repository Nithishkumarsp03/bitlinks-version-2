const db = require("../../db/config");

const updateStatus = (req, res) => {
  const { uuid, status } = req.body;

  const query = `UPDATE personalinfo SET status = ? WHERE uuid = ?;`;

  db.query(query, [status, uuid], (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error updating status" });
    } else {
      res.status(200).json({ message: "Status updated successfully" });
    }
  });
};

module.exports = { updateStatus };
