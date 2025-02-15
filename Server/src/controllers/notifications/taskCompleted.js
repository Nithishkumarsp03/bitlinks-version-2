const db = require("../../db/config");

const taskCompleted = (req, res) => {
  const { id, module, action } = req.body;

  const historyQuery = "UPDATE history SET status = 0 WHERE history_id = ?";
  const minutesQuery = "UPDATE minutes SET status = ? WHERE id = ?";

  if (module === "history") {
    db.query(historyQuery, id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating history" });
      } else {
        res.json({ message: "History updated successfully" });
      }
    });
  } else if (module === "minutes") {
    db.query(minutesQuery, [action, id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating minutes" });
      } else {
        res.json({ message: "Minutes updated successfully" });
      }
    });
  } else {
    res.status(400).json({ message: "Invalid module" });
  }
};

module.exports = { taskCompleted };
