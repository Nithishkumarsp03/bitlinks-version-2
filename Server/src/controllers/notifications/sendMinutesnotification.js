// sendMinutesnotification.js
const db = require("../../db/config");
const nodemailer = require("nodemailer");

const sendMinutesCron = (callback) => {
  // Updated query to fetch all needed data
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

    // Group records by recipient email.
    // Then further group by project title so all minutes for a project are together.
    const emailGroups = {};
    results.forEach((record) => {
      if (!emailGroups[record.email]) {
        emailGroups[record.email] = {
          handler: record.handler,
          projects: {},
        };
      }
      if (!emailGroups[record.email].projects[record.project_topic]) {
        emailGroups[record.email].projects[record.project_topic] = [];
      }
      emailGroups[record.email].projects[record.project_topic].push(record);
    });

    // Create a Nodemailer transporter (using Gmail in this example)
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailAddresses = Object.keys(emailGroups);
    let groupsProcessed = 0;

    // Process each email group (one email per recipient)
    emailAddresses.forEach((email) => {
      const group = emailGroups[email];

      // Build HTML email content with separate sections for each project
      let htmlContent = `<h2>Minutes Summary</h2>
        <p>Hi ${group.handler}, please find the below details for ur assigned task by IECC. 
        Industry Experts gave the suggestions. Kindly  work on it and revert to the IECC team. 
        If you have any queries, please contact IECC coordinators</p>`;

      // Iterate over each project for the recipient
      Object.keys(group.projects).forEach((projectTitle) => {
        htmlContent += `<h3>Project: ${projectTitle}</h3>
          <table style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #dddddd; padding: 8px;">Topic</th>
                <th style="border: 1px solid #dddddd; padding: 8px;">Description</th>
                <th style="border: 1px solid #dddddd; padding: 8px;">Due Date</th>
              </tr>
            </thead>
            <tbody>`;
        group.projects[projectTitle].forEach((record) => {
          htmlContent += `
              <tr>
                <td style="border: 1px solid #dddddd; padding: 8px;">${record.topic}</td>
                <td style="border: 1px solid #dddddd; padding: 8px;">${record.description}</td>
                <td style="border: 1px solid #dddddd; padding: 8px;">${record.due_date}</td>
              </tr>`;
        });
        htmlContent += `
            </tbody>
          </table>`;
      });

      // Email options for the current recipient
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Minutes Summary",
        html: htmlContent,
      };

      // Send the email for this recipient
      transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
          console.error(`Error sending email to ${email}:`, mailErr);
          // Optionally handle the error (e.g., continue to update or retry)
        } else {
          console.log(`Email sent to ${email}:`, info.response);
        }

        // Update all minutes records for this recipient as sent
        const ids = [];
        Object.values(group.projects).forEach((recordsArray) => {
          recordsArray.forEach((record) => {
            ids.push(record.id);
          });
        });

        const updateQuery = "UPDATE minutes SET isSent = 1 WHERE id IN (?)";
        db.query(updateQuery, [ids], (updateErr, updateResult) => {
          if (updateErr) {
            console.error(
              `Error updating records for email ${email}:`,
              updateErr
            );
          } else {
            console.log(
              `Records updated for email ${email}:`,
              updateResult.affectedRows
            );
          }
          groupsProcessed++;
          if (groupsProcessed === emailAddresses.length) {
            // When all groups have been processed, call the callback
            return callback(null, {
              message: "Emails sent and minutes updated successfully",
            });
          }
        });
      });
    });
  });
};

module.exports = { sendMinutesCron };
