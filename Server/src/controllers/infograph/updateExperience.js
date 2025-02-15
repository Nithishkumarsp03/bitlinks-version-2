const db = require("../../db/config");

const updateExperience = (req, res) => {
  const { uuid, experienceInfo, completion } = req.body;

  const getPersonIdQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const checkExperienceQuery = `SELECT * FROM previousexperience WHERE person_id = ?`;
  const updateExperienceQuery = `UPDATE previousexperience
                                  SET 
                                    ifexperience = ?,
                                    companyname = ?,
                                    position = ?,
                                    experience = ?,
                                    role = ?,
                                    companyaddress = ?,
                                    Experience_Completion = ?
                                  WHERE person_id = ?`;

  const insertExperienceQuery = `INSERT INTO previousexperience
                                  (ifexperience, companyname, position, experience, role, companyaddress, Experience_Completion, person_id)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Step 1: Get the person_id from the personalinfo table
  db.query(getPersonIdQuery, [uuid], (err, person) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching person_id" });
    }

    if (person.length === 0) {
      return res.status(404).json({ message: "Person not found" });
    }

    const personId = person[0].person_id;

    // Step 2: Check if the person_id already exists in the previousexperience table
    db.query(checkExperienceQuery, [personId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error checking experience" });
      }

      if (result.length > 0) {
        // If experience record exists, update it
        db.query(updateExperienceQuery, [
          experienceInfo.ifexperience ? "yes":"no",
          experienceInfo.companyname ? experienceInfo.companyname.value :null,
          experienceInfo.position,
          experienceInfo.experience,
          experienceInfo.role ? experienceInfo.role.value : null,
          experienceInfo.companyaddress ? experienceInfo.companyaddress.value : null,
          completion,
          personId
        ], (err, updateResult) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating experience" });
          }

          res.json({ message: "Experience updated successfully", experience: updateResult });
        });
      } else {
        // If no experience record exists, insert a new record
        db.query(insertExperienceQuery, [
          experienceInfo.ifexperience ? "yes": "no",
          experienceInfo.companyname ? experienceInfo.companyname.value :null,
          experienceInfo.position,
          experienceInfo.experience,
          experienceInfo.role ? experienceInfo.role.value : null,
          experienceInfo.companyaddress ? experienceInfo.companyaddress.value : null,
          completion,
          personId
        ], (err, insertResult) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error inserting experience" });
          }

          res.json({ message: "Experience added successfully", experience: insertResult });
        });
      }
    });
  });
};

module.exports = { updateExperience };
