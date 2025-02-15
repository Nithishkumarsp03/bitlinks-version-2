const db = require("../../db/config");

const fetchMinutes = (req, res) => {
  const { uuid, shaid } = req.body;
  // console.log(uuid)

  const getPersonIdQuery = 'SELECT person_id FROM personalinfo WHERE uuid = ?';
  const getProjectIdQuery = 'SELECT project_id, title from projects where sha_id = ?'
  const fetchMinutesQuery = 'SELECT * FROM minutes WHERE person_id = ? AND project_id = ? ORDER BY id DESC';

  
  db.query(getPersonIdQuery, [uuid], (err, personRows) => {
    if (err) {
      console.error("Error fetching person ID:", err);
      return res.status(500).json({ error: 'Failed to fetch person ID from the database' });
    }

    if (personRows.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    const person_id = personRows[0].person_id;
    // console.log(person_id);

    
    db.query(getProjectIdQuery, [shaid], (err, projectRows) => {
      if (err) {
        console.error("Error fetching project_id:", err);
        return res.status(500).json({ error: 'Failed to fetch project_id from the database' });
      }

      if (projectRows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }

      const project_id = projectRows[0].project_id;
      const title = projectRows[0].title;
    //   console.log(projectRows);

      db.query(fetchMinutesQuery, [person_id, project_id], (err, minuteRows) => {
        if (err) {
            console.error("Error fetching Minutes:", err);
            return res.status(500).json({ error: 'Failed to fetch Minutes from the database' });
        }

        if (minuteRows.length === 0) {
            return res.status(200).json({ title: title, error: "Minutes not found" });
        }

        res.status(200).json({ title: title, minutes: minuteRows });
      });
    });
  });
};

module.exports = { fetchMinutes };
