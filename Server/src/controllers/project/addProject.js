const db = require("../../db/config");

const addProject = (req, res) => {
  const { uuid, formValues } = req.body;

  const getPersonIdQuery = 'SELECT person_id FROM personalinfo WHERE uuid = ?';

  db.query(getPersonIdQuery, [uuid], (err, rows) => {
    if (err) {
      console.error("Error fetching person ID:", err);
      return res.status(500).json({ error: 'Failed to fetch person ID' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    const person_id = rows[0].person_id;

    const insertProjectquery = `
  INSERT INTO projects (sha_id, person_id, title, initial_date, due_date, domain, project_leader, status, project_level)
  VALUES (SHA2(CONCAT('1', NOW()), 256), ?, ?, ?, ?, ?, ?, "Pending", 0)
`;

    const values = [
      person_id,
      formValues.projectTitle,
      formValues.initialDate,
      formValues.dueDate,
      formValues.domain,
      formValues.projectLeader
    ];

    db.query(insertProjectquery, values, (err) => {
      if (err) {
        console.error("Error inserting project:", err);
        return res.status(500).json({ error: 'Failed to add project to database' });
      }

      res.status(200).json({ message: "project added successfully" });
    });
  });
};

module.exports = { addProject };
