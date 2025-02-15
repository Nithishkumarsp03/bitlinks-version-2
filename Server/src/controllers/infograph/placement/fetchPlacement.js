const db = require("../../../db/config");

const fetchPlacement = (req, res) => {
  const { uuid } = req.body;

  const getpersonidQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const getPlacementQuery = `SELECT * FROM placement WHERE person_id = ?`;

  db.query(getpersonidQuery, [uuid], (err, person) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching placement" });
    } else {
      const personId = person[0].person_id;
      db.query(getPlacementQuery, [personId], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error fetching placement" });
        } else {
          res.json({placement: result})
        }
      });
    }
  });
};

module.exports = { fetchPlacement };
