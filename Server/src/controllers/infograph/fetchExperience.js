const db = require("../../db/config");

const fetchExperience = (req, res) => {
  const { uuid } = req.body;

  const getpersonidQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const getExperienceQuery = `SELECT * FROM previousexperience WHERE person_id = ?`;

  db.query(getpersonidQuery, [uuid], (err, person) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching experience" });
    } else {
      const personId = person[0].person_id;
      db.query(getExperienceQuery, [personId], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error fetching experience" });
        } else {
          res.json({experience: result})
        }
      });
    }
  });
};

module.exports = { fetchExperience };
