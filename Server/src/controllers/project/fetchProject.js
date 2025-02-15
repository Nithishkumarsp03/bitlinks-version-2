const db = require("../../db/config");

const fetchProject = (req, res) => {
  const { uuid } = req.body;
  // console.log(uuid)

  const getPersonIdQuery = 'SELECT person_id FROM personalinfo WHERE uuid = ?';
  const fetchProjectQuery = `SELECT 
    p.*,
    COUNT(m.id) AS total_minutes, -- Total minutes excluding "Rejected"
    SUM(CASE WHEN m.status = 'Approved' THEN 1 ELSE 0 END) AS approved_minutes,
    (SUM(CASE WHEN m.status = 'Approved' THEN 1 ELSE 0 END) / COUNT(m.id)) * 100 AS approved_percentage
FROM 
    projects p
LEFT JOIN 
    minutes m 
ON 
    p.project_id = m.project_id
WHERE 
    p.person_id = ? AND 
    (m.status != 'Rejected' OR m.status IS NULL) -- Exclude "Rejected" status
GROUP BY 
    p.project_id
ORDER BY 
    p.project_id DESC;
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
    db.query(fetchProjectQuery, [person_id], (err, projectRows) => {
      if (err) {
        console.error("Error fetching history:", err);
        return res.status(500).json({ error: 'Failed to fetch history from the database' });
      }

      // Return the fetched history
      res.status(200).json({ projectRows });
    });
  });
};

module.exports = { fetchProject };
