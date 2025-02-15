const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../../db/config");

const sendEmail = async (req, res) => {
  const { email, subject, message, id, module } = req.body;
  // console.log(req.body);

  if (!email || !subject || !message || !id || !module) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Choose the correct query based on the module type
    let query;
    let values = [id];

    if (module === "history") {
      query = `UPDATE history SET status = 0, emailSent = 0 WHERE history_id = ?`;
    } else if (module === "dob") {
      query = `UPDATE personalinfo SET emailSent = 1 WHERE person_id = ?`;
    } else {
      return res.status(400).json({ error: "Invalid module type" });
    }

    // Execute the query
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ error: "Database update failed" });
      }
      console.log("Database updated successfully");

      res.status(200).json({ message: "Email sent and database updated" });
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = { sendEmail };
