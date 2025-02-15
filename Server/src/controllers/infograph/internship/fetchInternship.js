const db = require("../../../db/config");

const fetchInternship = (req, res) => {
  const { uuid } = req.body;

  const getpersonidQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const getInternshipQuery = `SELECT * FROM internship WHERE person_id = ?`;

  db.query(getpersonidQuery, [uuid], (err, person) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching internship" });
    } else {
      const personId = person[0].person_id;
      db.query(getInternshipQuery, [personId], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error fetching internship" });
        } else {
          res.json({internship: result})
        }
      });
    }
  });
};

module.exports = { fetchInternship };
