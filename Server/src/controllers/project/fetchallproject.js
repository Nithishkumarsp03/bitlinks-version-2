const db = require("../../db/config");

const fetchallProject = (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to page 1
  const limit = parseInt(req.query.limit) || 20; // default to 20 records per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      projects.*, 
      personalinfo.uuid,
      COUNT(minutes.id) AS total_minutes,
      SUM(CASE WHEN minutes.status = 'Approved' THEN 1 ELSE 0 END) AS approved_minutes,
      ROUND(
          (SUM(CASE WHEN minutes.status = 'Approved' THEN 1 ELSE 0 END) / NULLIF(COUNT(minutes.id), 0)) * 100,
          2
      ) AS approved_percentage
    FROM 
      projects
    LEFT JOIN 
      personalinfo ON projects.person_id = personalinfo.person_id
    LEFT JOIN 
      minutes ON projects.project_id = minutes.project_id
    WHERE 
      (minutes.status != 'Rejected' OR minutes.status IS NULL)
    GROUP BY 
      projects.project_id, personalinfo.uuid
    ORDER BY 
      projects.project_id DESC
    LIMIT ? OFFSET ?;
  `;

  db.query(query, [limit, offset], (err, projectData) => {
    if (err) {
      console.error("Error fetching projects", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch projects from the database" });
    }

    res.status(200).json({
      message: "Fetched Successfully",
      project: projectData,
      page,
      limit,
    });
  });
};

module.exports = { fetchallProject };
