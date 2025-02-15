const db = require("../../db/config");

const addMinutes = (req, res) => {
  const { uuid, shaid, formValues } = req.body;

  const fetchPersonIdQuery =
    "SELECT person_id FROM personalinfo WHERE uuid = ?";
  const getProjectIdQuery =
    "SELECT project_id FROM projects WHERE sha_id = ?";
  const insertMinutesQuery = `
    INSERT INTO minutes (
      person_id, project_id, topic, description, initial_date, due_date, status, handler, snooze
    ) VALUES (?, ?, ?, ?, ?, ?, "Pending", ?, 0)
  `;

  db.query(fetchPersonIdQuery, [uuid], (err, personRows) => {
    if (err) {
      console.error("Error fetching person ID:", err);
      return res.status(500).json({ error: "Failed to fetch person ID" });
    }

    if (personRows.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    const person_id = personRows[0].person_id;

    db.query(getProjectIdQuery, [shaid], (err, projectRows) => {
      if (err) {
        console.error("Error fetching project ID:", err);
        return res.status(500).json({ error: "Failed to fetch project ID" });
      }

      if (projectRows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      const project_id = projectRows[0].project_id;

      const values = [
        person_id,
        project_id,
        formValues.topic,
        formValues.description,
        formValues.initialDate,
        formValues.dueDate,
        formValues.projectLeader,
      ];

      db.query(insertMinutesQuery, values, (err) => {
        if (err) {
          console.error("Error inserting minutes:", err);
          return res.status(500).json({
            error: "Failed to add minutes to database",
          });
        }

        res.status(200).json({
          message: "History and Minutes added successfully",
        });
      });
    });
  });
};

module.exports = { addMinutes };
