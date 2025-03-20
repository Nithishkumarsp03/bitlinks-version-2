const db = require("../../db/config");

const fetchuserprojects = (req, res) => {
  const { name } = req.body; // Name to filter projects

  const fetchProjectQuery = `
    SELECT 
        p.*,
        pi.uuid, -- Fetch uuid from personalinfo table
        COUNT(m.id) AS total_minutes, 
        SUM(CASE WHEN m.status = 'Approved' THEN 1 ELSE 0 END) AS approved_minutes,
        (SUM(CASE WHEN m.status = 'Approved' THEN 1 ELSE 0 END) / COUNT(m.id)) * 100 AS approved_percentage
    FROM 
        projects p
    LEFT JOIN 
        minutes m 
    ON 
        p.project_id = m.project_id
    LEFT JOIN 
        personalinfo pi -- Join personalinfo table
    ON 
        p.person_id = pi.person_id -- Match person_id from projects and personalinfo
    WHERE 
        (p.project_leader = ? OR m.handler = ?)  -- Fetch by project_leader or handler
        AND (m.status != 'Rejected' OR m.status IS NULL) 
    GROUP BY 
        p.project_id, pi.uuid  -- Group by project_id and uuid to avoid aggregation issues
    ORDER BY 
        p.project_id DESC;
  `;

  db.query(fetchProjectQuery, [name, name], (err, results) => {
    if (err) {
      console.error("Error fetching user projects:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ project: results });
  });
};

module.exports = { fetchuserprojects };
