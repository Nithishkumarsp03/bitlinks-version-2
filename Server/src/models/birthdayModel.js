const db = require("../db/config");

function getTodaysBirthdays(callback) {
  const today = new Date().toISOString().slice(5, 10); // Get MM-DD format

  // Reset emailSent for users whose last update was last year
  const resetQuery = `
    UPDATE personalinfo  
    SET emailSent = FALSE  
    WHERE STR_TO_DATE(dob, '%Y-%m-%d') IS NOT NULL  
    AND DATE_FORMAT(STR_TO_DATE(dob, '%Y-%m-%d'), '%m-%d') = ?  
    AND (updated_at IS NULL OR YEAR(updated_at) < YEAR(NOW()));
  `;

  db.query(resetQuery, [today], (err, result) => {
    if (err) {
      console.error("Error resetting emailSent status:", err);
      return callback(err, null);
    }

    // Fetch today's birthdays after resetting emailSent
    const selectQuery = `
      SELECT uuid, profile, fullname, dob, email  
      FROM personalinfo  
      WHERE STR_TO_DATE(dob, '%Y-%m-%d') IS NOT NULL  
      AND DATE_FORMAT(STR_TO_DATE(dob, '%Y-%m-%d'), '%m-%d') = ?  
      AND (emailSent = FALSE OR emailSent IS NULL);
    `;

    db.query(selectQuery, [today], (err, dobResults) => {
      if (err) {
        console.error("Error fetching birthdays:", err);
        return callback(err, null);
      }
      callback(null, dobResults);
    });
  });
}

module.exports = { getTodaysBirthdays };
