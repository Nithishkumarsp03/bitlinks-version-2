const db = require("../../db/config");

const SnoozeTask = (req, res) => {
  const { id, module, days } = req.body;
  // console.log(req.body)

  if (!id || !module || !days) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Function to add days to a date
  const addDays = (date, daysToAdd) => {
    const newDate = new Date(date); 
    // newDate.setDate(newDate.getDate() + daysToAdd);
    // return newDate.toISOString().slice(0, 19).replace('T', ' ');

    let tempDate = new Date(newDate.setDate(newDate.getDate() + daysToAdd));
    const oldDate = new Date(tempDate);
    const formattedDate = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, '0')}-${String(oldDate.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(oldDate.getHours()).padStart(2, '0')}:${String(oldDate.getMinutes()).padStart(2, '0')}`;
    let scheduledDate = `${formattedDate} ${formattedTime}`;
    return scheduledDate;
  };
  const addDaysminutes = (date, daysToAdd) => {
    const newDate = new Date(date); 
    // newDate.setDate(newDate.getDate() + daysToAdd);
    // return newDate.toISOString().slice(0, 19).replace('T', ' ');

    let tempDate = new Date(newDate.setDate(newDate.getDate() + daysToAdd));
    const oldDate = new Date(tempDate);
    const formattedDate = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, '0')}-${String(oldDate.getDate()).padStart(2, '0')}`;
    return formattedDate;
  };

  const historyQuery = "SELECT scheduleddate, snooze FROM history WHERE history_id = ?";
  const updateHistoryQuery = "UPDATE history SET scheduleddate = ?, snooze = ? WHERE history_id = ?";
  const minutesQuery = "SELECT due_date, snooze FROM minutes WHERE id = ?";
  const updateMinutesQuery = "UPDATE minutes SET due_date = ?, snooze = ? WHERE id = ?";

  if (module === "history") {
    // Get the current scheduleddate
    db.query(historyQuery, [id], (err, result) => {
      if (err || result.length === 0) {
        console.log(err || "No history record found");
        res.status(500).json({ message: "Error fetching history data" });
      } else {
        const currentDate = result[0].scheduleddate;
        const snoozeCount = result[0].snooze;
        const newDate = addDays(currentDate, days);

        // Update the scheduleddate
        db.query(updateHistoryQuery, [newDate, snoozeCount+1,  id], (updateErr) => {
          if (updateErr) {
            console.log(updateErr);
            res.status(500).json({ message: "Error updating history" });
          } else {
            res.json({ message: "History updated successfully", newDate });
          }
        });
      }
    });
  } else if (module === "minutes") {
    // Get the current due_date
    db.query(minutesQuery, [id], (err, result) => {
      if (err || result.length === 0) {
        console.log(err || "No minutes record found");
        res.status(500).json({ message: "Error fetching minutes data" });
      } else {
        const currentDate = result[0].due_date;
        const snoozeCount = result[0].snooze;
        const newDate = addDaysminutes(currentDate, days);

        // Update the due_date
        db.query(updateMinutesQuery, [newDate, snoozeCount+1, id], (updateErr) => {
          if (updateErr) {
            console.log(updateErr);
            res.status(500).json({ message: "Error updating minutes" });
          } else {
            res.json({ message: "Minutes updated successfully", newDate });
          }
        });
      }
    });
  } else {
    res.status(400).json({ message: "Invalid module" });
  }
};

module.exports = { SnoozeTask };