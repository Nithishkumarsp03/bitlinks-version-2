const db = require("../../db/config");

const addConnection = (req, res) => {
  const { finalData } = req.body;

  const query = `INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, dob, rating, designation, visitingcard, linkedinurl, address, shortdescription, hashtags, spoc)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const rankQuery = `INSERT INTO person_points_summary (person_id, \`rank\`, last_updated) VALUES (?, ?, NOW())`;

  const values = [
    finalData.useremail,
    finalData.profilePhoto || "/uploads/1738045401481-user.jpg",
    finalData.fullname,
    finalData.phonenumber,
    finalData.age,
    finalData.email,
    finalData.dob,
    finalData.rating,
    finalData.designation,
    finalData.visitingCardPhoto,
    finalData.linkedinUrl,
    finalData.address,
    finalData.shortdescription,
    finalData.hashtags,
    finalData.spoc,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Contact already exists in the database" });
      }
      console.error("Error inserting data in personalinfo:", err);
      return res.status(500).json({ error: "Failed to add person to database" });
    }

    const insertedId = result.insertId;

    db.query(rankQuery, [insertedId, finalData.rank], (err) => {
      if (err) {
        console.error("Error inserting data in person_points_summary:", err);
        return res.status(500).json({ error: "Failed to add rank to database" });
      }

      res.status(200).json({
        message: "Connection created successfully",
      });
    });
  });
};

module.exports = { addConnection };
