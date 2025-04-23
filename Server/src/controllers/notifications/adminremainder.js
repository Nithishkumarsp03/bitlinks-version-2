const db = require("../../db/config");

const fetchAdminnotification = async (req, res) => {
  const responseData = {}; // Object to store results

  const findSnoozeQuery = `
    SELECT 
      personalinfo.fullname, 
      personalinfo.uuid, 
      personalinfo.email, 
      h.*
    FROM 
      history h
    JOIN 
      personalinfo ON h.person_id = personalinfo.person_id
    WHERE 
      h.snooze > 0 
      AND h.status = 1;
  `;

  db.query(findSnoozeQuery, (err, snoozeResults) => {
    if (err) {
      console.error("Error fetching snoozed notifications:", err);
      return res.status(500).json({ error: "Database error" });
    }
    responseData.snoozed_notifications = snoozeResults;

    const minutesDeadlinecrossed = `
      SELECT 
        personalinfo.fullname, 
        personalinfo.uuid, 
        personalinfo.email, 
        projects.sha_id,
        m.*
      FROM 
        minutes m
      JOIN 
        personalinfo ON m.person_id = personalinfo.person_id
      INNER JOIN
        projects ON m.project_id = projects.project_id
      WHERE 
        STR_TO_DATE(m.due_date, '%Y-%m-%d') < CURDATE()
        AND m.status = 'Pending';
    `;

    db.query(minutesDeadlinecrossed, (err, minutesResults) => {
      if (err) {
        console.error("Error fetching overdue minutes:", err);
        return res.status(500).json({ error: "Database error" });
      }
      responseData.overdue_minutes = minutesResults;

      const historyDeadlinecrossed = `
        SELECT 
          personalinfo.fullname, 
          personalinfo.uuid, 
          personalinfo.email AS contact_email, 
          h.email AS agent_email,
          h.*
        FROM 
          history h
        JOIN 
          personalinfo ON h.person_id = personalinfo.person_id
        WHERE 
          STR_TO_DATE(h.scheduleddate, '%Y-%m-%d') < CURDATE()
          AND h.status = 1;
      `;

      db.query(historyDeadlinecrossed, (err, historyResults) => {
        if (err) {
          console.error("Error fetching overdue history:", err);
          return res.status(500).json({ error: "Database error" });
        }
        responseData.overdue_history = historyResults;

        // Update emailSent to 0 for records with a valid dob where:
        // - The birthday (converted from the varchar) is today, and
        // - The date part of updated_at is NOT equal to today's date.
        const updateDOBQuery = `
          UPDATE personalinfo
          SET emailSent = 0
          WHERE dob IS NOT NULL
            AND dob <> ''
            AND MONTH(STR_TO_DATE(dob, '%Y-%m-%d')) = MONTH(CURDATE())
            AND DAY(STR_TO_DATE(dob, '%Y-%m-%d')) = DAY(CURDATE())
            AND DATE(updated_at) <> CURDATE();
        `;
        db.query(updateDOBQuery, (err, updateResult) => {
          if (err) {
            console.error("Error updating emailSent for DOB:", err);
            return res.status(500).json({ error: "Database error" });
          }
          // console.log("DOB update result:", updateResult);

          // Now fetch the birthday records where emailSent is 0 (and dob has a valid value)
          const dobQuery = `
            SELECT uuid, profile, fullname, dob, email, person_id, emailSent
            FROM personalinfo 
            WHERE dob IS NOT NULL
              AND dob <> ''
              AND MONTH(STR_TO_DATE(dob, '%Y-%m-%d')) = MONTH(CURDATE()) 
              AND DAY(STR_TO_DATE(dob, '%Y-%m-%d')) = DAY(CURDATE());
          `;
          db.query(dobQuery, (err, dobResults) => {
            if (err) {
              console.error("Error fetching birthdays:", err);
              return res.status(500).json({ error: "Database error" });
            }
            responseData.birthdays_today = dobResults;

            const minutesCompleted = `
              SELECT 
                personalinfo.fullname,
                personalinfo.uuid, 
                personalinfo.email, 
                projects.sha_id,
                m.*
              FROM 
                minutes m
              JOIN 
                personalinfo ON m.person_id = personalinfo.person_id
              INNER JOIN
                projects ON m.project_id = projects.project_id
              WHERE
                m.status = 'Completed'; 
            `;
            db.query(minutesCompleted, (err, completedResults) => {
              if (err) {
                console.error("Error fetching completed minutes:", err);
                return res.status(500).json({ error: "Database error" });
              }
              responseData.completed_minutes = completedResults;

              const updatedStatus = `
                SELECT 
                  personalinfo.fullname, 
                  personalinfo.uuid, 
                  personalinfo.email, 
                  projects.sha_id,
                  m.*
                FROM 
                  minutes m
                JOIN 
                  personalinfo ON m.person_id = personalinfo.person_id
                INNER JOIN
                  projects ON m.project_id = projects.project_id
                WHERE 
                  m.status IN ('Approved', 'Rejected') 
                  AND m.updated_at >= NOW() - INTERVAL 2 DAY;
              `;
              db.query(updatedStatus, (err, updatedResults) => {
                if (err) {
                  console.error("Error fetching recently updated status:", err);
                  return res.status(500).json({ error: "Database error" });
                }
                responseData.recently_updated_status = updatedResults;

                // Send final response after all queries have executed
                res.json(responseData);
              });
            });
          });
        });
      });
    });
  });
};

module.exports = { fetchAdminnotification };
