const db = require("../../../db/config");

const fetchAlumni = (req, res) => {
  const { uuid } = req.body;

  const getpersonidQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const getCompanyQuery = `SELECT * FROM alumni WHERE person_id = ?`;

  db.query(getpersonidQuery, [uuid], (err, person) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching alumni" });
    } else {
      const personId = person[0].person_id;
      db.query(getCompanyQuery, [personId], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error fetching alumni" });
        } else {
          res.json({alumni: result})
        }
      });
    }
  });
};

module.exports = { fetchAlumni };
