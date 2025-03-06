// sendMinutesnotification.js
const db = require('../../db/config');
const nodemailer = require('nodemailer');

const sendMinutesCron = (callback) => {
  // Updated query: join minutes, personalinfo, and projects to fetch all needed data
  const query = `
    SELECT m.id, m.topic, m.description, m.due_date, m.handler, p.email, proj.title AS project_topic
    FROM minutes m
    INNER JOIN personalinfo p ON m.handler = p.fullname
    INNER JOIN projects proj ON m.project_id = proj.project_id
    WHERE m.isSent = 0
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return callback(err);
    } 
    
    if (results.length === 0) {
      return callback(null, { message: "No unsent minutes found." });
    }
    
    // Group records by recipient email so each recipient receives one email
    const emailGroups = {};
    results.forEach(record => {
      if (!emailGroups[record.email]) {
        emailGroups[record.email] = [];
      }
      emailGroups[record.email].push(record);
    });
    
    // Create a Nodemailer transporter (using Gmail in this example)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const emailAddresses = Object.keys(emailGroups);
    let groupsProcessed = 0;
    
    // Process each email group separately
    emailAddresses.forEach(email => {
      const groupRecords = emailGroups[email];
      // Use the first record in the group to get handler and project info
      const firstRecord = groupRecords[0];
      
      // Build HTML email content with a table
      let htmlContent = `
        <h2>Minutes Summary</h2>
        <p>Hello ${firstRecord.handler}, please find below the details of the minutes for project "${firstRecord.project_topic}".</p>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #dddddd; padding: 8px;">Topic</th>
              <th style="border: 1px solid #dddddd; padding: 8px;">Description</th>
              <th style="border: 1px solid #dddddd; padding: 8px;">Due Date</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      groupRecords.forEach(record => {
        htmlContent += `
          <tr>
            <td style="border: 1px solid #dddddd; padding: 8px;">${record.topic}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${record.description}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${record.due_date}</td>
          </tr>
        `;
      });
      
      htmlContent += `
          </tbody>
        </table>
      `;
      
      // Email options for the current recipient
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Minutes Summary",
        html: htmlContent
      };
      
      // Send the email for this group
      transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
          console.error(`Error sending email to ${email}:`, mailErr);
          // Optionally, you could call callback here for error—depending on desired behavior
        } else {
          console.log(`Email sent to ${email}:`, info.response);
        }
        
        // Update the minutes records for this group as sent
        const ids = groupRecords.map(record => record.id);
        const updateQuery = "UPDATE minutes SET isSent = 1 WHERE id IN (?)";
        db.query(updateQuery, [ids], (updateErr, updateResult) => {
          if (updateErr) {
            console.error(`Error updating records for email ${email}:`, updateErr);
          } else {
            console.log(`Records updated for email ${email}:`, updateResult.affectedRows);
          }
          groupsProcessed++;
          if (groupsProcessed === emailAddresses.length) {
            // When all groups have been processed, call the callback
            return callback(null, { message: "Emails sent and minutes updated successfully" });
          }
        });
      });
    });
  });
};

module.exports = { sendMinutesCron };
