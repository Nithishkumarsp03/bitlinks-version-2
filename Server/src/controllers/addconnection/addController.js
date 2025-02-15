const db = require("../../db/config");
const authenticate = require('../../middleware/authMiddleware')

const addConnection = (req, res, authenticate) => {
  const { finalData } = req.body;
  console.log(req.body);

  const query = `INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, dob, rating, designation, visitingcard, linkedinurl, address, shortdescription, hashtags, spoc)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const rankQuery = `INSERT INTO person_points_summary (person_id, \`rank\`, last_updated) VALUES (?, ?, NOW())`;

  const values = [
    finalData.useremail,
    finalData.profilePhoto || "/uploads/1738045401481-user.jpg", // Fixed profilePhoto reference
    finalData.fullname,
    finalData.phonenumber,
    finalData.age,
    finalData.email,
    finalData.dob,
    finalData.rating,
    finalData.designation,
    finalData.visitingCardPhoto,
    finalData.linkedinurl,
    finalData.address,
    finalData.shortdescription,
    finalData.hashtags,
    finalData.spoc,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data in personalinfo:", err);
      return res.status(500).json({ error: "Failed to add person to database" });
    }

    // Fetch the inserted ID
    const insertedId = result.insertId;
    console.log("Inserted ID:", insertedId);

    // Insert into rank table and only send response after it's done
    db.query(rankQuery, [insertedId, finalData.rank], (err) => {
      if (err) {
        console.error("Error inserting data in person_points_summary:", err);
        return res.status(500).json({ error: "Failed to add rank to database" });
      }

      res.status(200).json({
        message: "Connection created successfully",
        // insertedId: insertedId,
      });
    });
  });
};

module.exports = { addConnection };
