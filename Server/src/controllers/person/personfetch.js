const db = require("../../db/config");

const fetchPerson = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const query = `
    SELECT 
      p1.*, 
      COALESCE(p2.fullname, p1.fullname) AS sub_name,  -- Use the main name if sub_name is NULL
      company.*, 
      expertise.*, 
      pps.*
    FROM personalinfo p1
    LEFT JOIN company ON p1.person_id = company.person_id
    LEFT JOIN expertise ON p1.person_id = expertise.person_id
    LEFT JOIN personalinfo p2 ON p2.person_id = p1.sub_id
    LEFT JOIN person_points_summary pps ON pps.person_id = p1.person_id
    WHERE p1.useremail = ?
    ORDER BY p1.person_id DESC
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Fetching error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    res.status(200).json({ data: results });
  });
};

module.exports = { fetchPerson };
