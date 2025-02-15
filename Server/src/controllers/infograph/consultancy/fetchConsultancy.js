const db = require("../../../db/config");

const fetchConsultancy = (req, res) => {
  const { uuid } = req.body;

  const getpersonidQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const getConsultancyQuery = `SELECT * FROM consultancy WHERE person_id = ?`;

  db.query(getpersonidQuery, [uuid], (err, person) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching consultancy" });
    } else {
      const personId = person[0].person_id;
      db.query(getConsultancyQuery, [personId], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error fetching consultancy" });
        } else {
          res.json({consultancy: result})
        }
      });
    }
  });
};

module.exports = { fetchConsultancy };
