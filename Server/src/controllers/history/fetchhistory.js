const db = require("../../db/config");

const fetchHistory = (req, res) => {
  const { uuid } = req.body;
  // console.log(uuid)

  const getPersonIdQuery = 'SELECT person_id FROM personalinfo WHERE uuid = ?';
  const fetchHistoryQuery = `SELECT 
    h.*, 
    (SELECT SUM(points) FROM history WHERE person_id = h.person_id) AS total_points
FROM 
    history h
WHERE 
    h.person_id = ?
ORDER BY 
    h.history_id DESC;
`;

  // Fetch person_id using the provided UUID
  db.query(getPersonIdQuery, [uuid], (err, personRows) => {
    if (err) {
      console.error("Error fetching person ID:", err);
      return res.status(500).json({ error: 'Failed to fetch person ID from the database' });
    }

    if (personRows.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    const person_id = personRows[0].person_id;

    // Fetch history records for the person_id
    db.query(fetchHistoryQuery, [person_id], (err, historyRows) => {
      if (err) {
        console.error("Error fetching history:", err);
        return res.status(500).json({ error: 'Failed to fetch history from the database' });
      }

      // Return the fetched history
      res.status(200).json({ message: "Fetched Successfully", history: historyRows });
    });
  });
};

module.exports = { fetchHistory };
