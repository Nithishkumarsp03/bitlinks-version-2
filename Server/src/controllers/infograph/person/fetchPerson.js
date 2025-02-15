const db = require("../../../db/config");

const fetchPerson = (req, res) => {
  const { uuid } = req.body;

  const query = `SELECT p1.*, p2.fullname AS projectLeader
FROM personalinfo p1
LEFT JOIN personalinfo p2 
ON p1.sub_id = p2.person_id
WHERE p1.uuid = ?;
`;

  db.query(query, [uuid], (err, person) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching person" });
    }
    res.json({person});
  });
};

module.exports = { fetchPerson };
