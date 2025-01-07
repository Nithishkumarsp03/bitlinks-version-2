const db = require("../../db/config");

const addHistory = (req, res) => {
  const { historyData } = req.body;

  let points = 0;
  let status = 0;
  let emailSent = false;

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

  if (historyData.type === "Reschedule Visit" || historyData.type === "Reschedule Call") {
    status = 1;
    emailSent = true;
  } else {
    status = 0;
    emailSent = false;
  }

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

    const values = [
      person_id,
      historyData.name,
      historyData.email,
      historyData.type,
      historyData.note,
      historyData.purpose,
      historyData.datetime,
      historyData.rescheduleDatetime,
      historyData.image1,
      historyData.image2,
      points,
      status,
      emailSent
    ];

    db.query(insertHistoryQuery, values, (err) => {
      if (err) {
        console.error("Error inserting history:", err);
        return res.status(500).json({ error: 'Failed to add history to database' });
      }

      res.status(200).json({ message: "History added successfully", historyData });
    });
  });
};

module.exports = { addHistory };
