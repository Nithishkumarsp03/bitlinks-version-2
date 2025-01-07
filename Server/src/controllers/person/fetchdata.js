const db = require("../../db/config");

const fetchdata = (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ message: "id is required" });
  }

  const query = `
    SELECT 
      p1.*, 
      COALESCE(p2.fullname, p1.fullname) AS sub_name, -- Use the main name if sub_name is NULL
      company.*, 
      expertise.*, 
      pps.*, 
      (SELECT COUNT(*) 
       FROM personalinfo 
       WHERE sub_id = p1.person_id) AS connection_count -- Count of connections
    FROM personalinfo p1
    INNER JOIN company ON p1.person_id = company.person_id
    LEFT JOIN expertise ON p1.person_id = expertise.person_id
    LEFT JOIN personalinfo p2 ON p2.person_id = p1.sub_id
    LEFT JOIN person_points_summary pps ON pps.person_id = p1.person_id
    WHERE p1.uuid = ?
    ORDER BY p1.person_id DESC
  `;

  db.query(query, [uuid], (err, results) => {
    if (err) {
      console.error("Fetching error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with this id" });
    }

    res.status(200).json({ data: results });
  });
};

module.exports = { fetchdata };
