const db = require("../../../db/config");

const addskillset = (req, res) => {
  const { skillset_column } = req.body;
  const query = `INSERT INTO skillset_table (skillset_column) VALUES (?)`;

  db.query(query, [skillset_column], (err) => {
    if (err) {
      return res.status(400).json({ message: "Error adding skillset" });
    } else {
      return res.status(200).json({ message: "skillset added" });
    }
  });
};

module.exports = { addskillset };
