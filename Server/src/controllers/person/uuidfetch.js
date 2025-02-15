const db = require("../../db/config");

const uuidFetch = (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ message: "ID is required" });
  }

  const query = `
    SELECT 
      p1.*, 
      COALESCE(p2.fullname, p1.fullname) AS sub_name, 
      company.*, 
      expertise.*, 
      pps.*
    FROM personalinfo p1
    LEFT JOIN company ON p1.person_id = company.person_id
    LEFT JOIN expertise ON p1.person_id = expertise.person_id
    LEFT JOIN personalinfo p2 ON p2.person_id = p1.sub_id
    LEFT JOIN person_points_summary pps ON pps.person_id = p1.person_id
    WHERE p1.uuid = ?
    ORDER BY p1.person_id DESC`;

  db.query(query, [uuid], (error, results) => {
    if (error) {
      console.error("Fetching error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with this ID" });
    }

    res.status(200).json({ data: results });
  });
};

module.exports = { uuidFetch };
