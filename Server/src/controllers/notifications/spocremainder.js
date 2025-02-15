const db = require("../../db/config");

const fetchSpocnotification = (req, res) => {
  const { email } = req.body; // spoc's email

  // First, update emailSent to 0 for valid DOB records for this user
  const updateDOBQuery = `
    UPDATE personalinfo
    SET emailSent = 0
    WHERE useremail = ?
      AND dob IS NOT NULL
      AND dob <> ''
      AND MONTH(STR_TO_DATE(dob, '%Y-%m-%d')) = MONTH(CURDATE())
      AND DAY(STR_TO_DATE(dob, '%Y-%m-%d')) = DAY(CURDATE())
      AND DATE(updated_at) <> CURDATE();
  `;
  
  db.query(updateDOBQuery, [email], (err, updateResult) => {
    if (err) {
      console.error("Error updating DOB emailSent:", err);
      // Depending on your needs, you might want to return here or simply log and continue.
      // return res.status(500).json({ error: "Error updating DOB emailSent", details: err });
    }
    
    // Now fetch the DOB information (birthday records where emailSent is 0)
    const dobQuery = `
      SELECT uuid, profile, fullname, dob, emailSent
      FROM personalinfo
      WHERE useremail = ?
        AND dob IS NOT NULL
        AND dob <> ''
        AND MONTH(STR_TO_DATE(dob, '%Y-%m-%d')) = MONTH(CURDATE())
        AND DAY(STR_TO_DATE(dob, '%Y-%m-%d')) = DAY(CURDATE())
    `;
    
    db.query(dobQuery, [email], (err, dobResult) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching DOB information", details: err });
      }
      
      const results = {};
      if (dobResult.length > 0) {
        results.dobInfo = dobResult;
      }
      
      // Query to fetch history where status is 1 for this spoc
      const historyQuery = `
        SELECT 
          history.*, 
          personalinfo.uuid, 
          personalinfo.profile, 
          personalinfo.fullname, 
          personalinfo.email, 
          history.email AS spocemail
        FROM 
          history
        INNER JOIN 
          personalinfo 
        ON 
          history.person_id = personalinfo.person_id
        WHERE 
          history.type IN ('Visited', 'Reschedule Call', 'Reschedule Visit')
          AND history.scheduleddate <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          AND history.status = 1
          AND history.emailsent = 1
          AND personalinfo.useremail = ?;
      `;
      
      db.query(historyQuery, [email], (err, historyResult) => {
        if (err) {
          return res.status(500).json({ error: "Error fetching history information", details: err });
        }
        results.historyInfo = historyResult;
        
        // Query to fetch minutes information for this spoc
        const minutesQuery = `
          SELECT 
            minutes.*, 
            projects.sha_id,
            personalinfo.uuid, 
            personalinfo.profile, 
            personalinfo.fullname, 
            personalinfo.email,
            CASE 
                WHEN minutes.status = 'Pending' AND minutes.due_date < CURDATE() THEN 'Yes'
                ELSE 'No'
            END AS overdue
          FROM 
            minutes 
          INNER JOIN 
            personalinfo
          ON 
            minutes.person_id = personalinfo.person_id
          INNER JOIN 
            projects
          ON 
            minutes.project_id = projects.project_id
          WHERE 
            personalinfo.useremail = ?
            AND (
                (minutes.status IN ('Approved', 'Rejected', 'Pending') AND minutes.updated_at >= DATE_SUB(CURDATE(), INTERVAL 3 DAY))
                OR (
                    minutes.status = 'Pending' AND 
                    minutes.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
                )
            );
        `;
        
        db.query(minutesQuery, [email], (err, minutesResult) => {
          if (err) {
            return res.status(500).json({ error: "Error fetching minutes information", details: err });
          }
          results.minutesInfo = minutesResult;
          
          // Send the final response
          res.status(200).json(results);
        });
      });
    });
  });
};

module.exports = { fetchSpocnotification };
