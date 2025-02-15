const db = require("../../db/config");

const fetchdata = (req, res) => {

  const query = `
    SELECT 
    p1.*, 
    (SELECT COUNT(*) 
     FROM personalinfo 
     WHERE status = 0 AND p1.person_id = sub_id) AS inactive_count, -- Count of inactive users
    (
      SELECT COUNT(*) 
      FROM history h
      LEFT JOIN minutes m ON h.person_id = m.person_id -- Ensures person_id exists in both tables
      WHERE h.SNOOZE > 0 AND m.SNOOZE > 0 AND h.person_id = p1.person_id
    ) AS snooze_count -- Count only if person_id exists in both tables and snooze > 0
FROM personalinfo p1
LEFT JOIN company ON p1.person_id = company.person_id
LEFT JOIN expertise ON p1.person_id = expertise.person_id
LEFT JOIN personalinfo p2 ON p2.person_id = p1.sub_id
LEFT JOIN person_points_summary pps ON pps.person_id = p1.person_id
WHERE p1.spoc = 'yes'
ORDER BY p1.person_id DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Fetching error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No Spoc found" });
    }

    res.status(200).json({ data: results });
  });
};

module.exports = { fetchdata };