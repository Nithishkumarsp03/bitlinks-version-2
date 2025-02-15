const db = require("../../db/config");

const fetchallProject = (req, res) => {
  const query = `SELECT 
    projects.*, 
    personalinfo.uuid,
    COUNT(minutes.id) AS total_minutes, -- Total minutes excluding "Rejected"
    SUM(CASE WHEN minutes.status = 'Approved' THEN 1 ELSE 0 END) AS approved_minutes, -- Approved minutes count
    ROUND(
        (SUM(CASE WHEN minutes.status = 'Approved' THEN 1 ELSE 0 END) / NULLIF(COUNT(minutes.id), 0)) * 100,
        2
    ) AS approved_percentage -- Approved percentage rounded to 2 decimal places
FROM 
    projects
LEFT JOIN 
    personalinfo 
ON 
    projects.person_id = personalinfo.person_id
LEFT JOIN 
    minutes 
ON 
    projects.project_id = minutes.project_id -- Join projects with minutes using project_id
WHERE 
    (minutes.status != 'Rejected' OR minutes.status IS NULL) -- Exclude "Rejected" statuses
GROUP BY 
    projects.project_id, personalinfo.uuid;

        `;

  db.query(query, (err, projectData) => {
    if (err) {
      console.error("Error fetching domain", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch domain from the database" });
    }

    res
      .status(200)
      .json({ message: "Fetched Successfully", project: projectData });
  });
};

module.exports = { fetchallProject };
