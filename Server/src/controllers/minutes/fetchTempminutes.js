const db = require("../../db/config");

const fetchTempminutes = (req, res) => {
  const query = `SELECT minutes_copy.*, personalinfo.fullname 
FROM minutes_copy 
INNER JOIN personalinfo ON personalinfo.person_id = minutes_copy.person_id;
`;

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
