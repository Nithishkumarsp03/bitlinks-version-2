const db = require("../../db/config");

const fetchTempminutes = (req, res) => {
  const query = `SELECT * FROM minutes_copy`;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching data" });
    } else {
      res.json(results);
    }
  });
};

module.exports = { fetchTempminutes };
