const db = require("../../db/config");

const addHistory = (req, res) => {
  const { historyData } = req.body;
  // console.log(req.body);

  let points = 0;
  let status = 0;
  let emailSent = false;
  let tempDate = null;
  let scheduledDate = null;

  if (historyData.type === 'Call') {
    points = 3;
  } else if (historyData.type === 'Visited') {
    points = 5;
  } else if (historyData.type === 'Completed') {
    points = 10;
  } else if (historyData.type === 'Email' || historyData.type === 'Message') {
    points = 2;
  } else {
    points = 0;
  }

  if (historyData.type === "Reschedule Visit" || historyData.type === "Reschedule Call" || historyData.type === "Visited") {
    status = 1;
    emailSent = true;
  } else {
    status = 0;
    emailSent = false;
  }

  if (historyData.type === "Visited") {
    const today = new Date();
    tempDate = new Date(today.setDate(today.getDate() + 3));
}

const date = new Date(tempDate);
const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
scheduledDate = `${formattedDate} ${formattedTime}`;

  const getPersonIdQuery = 'SELECT person_id FROM personalinfo WHERE uuid = ?';

  db.query(getPersonIdQuery, [historyData.uuid], (err, rows) => {
    if (err) {
      console.error("Error fetching person ID:", err);
      return res.status(500).json({ error: 'Failed to fetch person ID' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    const person_id = rows[0].person_id;

    const insertHistoryQuery = `
      INSERT INTO history (person_id, agent, email, type, note, purpose, datetime, scheduleddate, visited1, visited2, points, status, emailSent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const historyValues = [
      person_id,
      historyData.name,
      historyData.email,
      historyData.type,
      historyData.note,
      historyData.purpose,
      historyData.datetime,
      historyData.rescheduleDatetime || scheduledDate,
      historyData.image1,
      historyData.image2,
      points,
      status,
      emailSent
    ];

    db.query(insertHistoryQuery, historyValues, (err) => {
      if (err) {
        console.error("Error inserting history:", err);
        return res.status(500).json({ error: 'Failed to add history to database' });
      }

      // Insert into the 'minutes' table if type is 'Minutes'
      if (historyData.type === 'Minutes') {

        const getProjectIdQuery = 'SELECT project_id FROM projects WHERE title = ?';
        db.query(getProjectIdQuery, [historyData.project], (err, rows) => {
          if (err) {
            console.error("Error fetching project ID:", err);
            return res.status(500).json({ error: 'Failed to fetch project ID' });
          }

          if (rows.length === 0) {
            return res.status(404).json({ error: "project not found" });
          }
      
          const project_id = rows[0].project_id;

          const insertMinutesQuery = `
          INSERT INTO minutes (person_id, project_id, topic, description, initial_date, due_date, status, handler, snooze)
          VALUES (?, ?, ?, ?, ?, ?, "Pending", ?, 0)
        `;

        const minutesValues = [
          person_id,
          project_id,
          historyData.minute,
          historyData.note,
          historyData.datetime,
          historyData.dueDate,
          historyData.name,
        ];

        db.query(insertMinutesQuery, minutesValues, (err) => {
          if (err) {
            console.error("Error inserting minutes:", err);
            return res.status(500).json({ error: 'Failed to add minutes to database' });
          }

          res.status(200).json({ message: "History and Minutes added successfully", historyData });
        });
        })

      } else {
        res.status(200).json({ message: "History added successfully", historyData });
      }
    });
  });
};

module.exports = { addHistory };
