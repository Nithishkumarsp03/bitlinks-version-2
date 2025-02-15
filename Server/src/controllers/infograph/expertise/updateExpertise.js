const db = require("../../../db/config");

const updateExpertise = (req, res) => {
  const { uuid, domain, specialistskills, skillset, completion } = req.body;
  // console.log(req.body);

  const getPersonIdQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const checkExpertiseQuery = `SELECT * FROM expertise WHERE person_id = ?`;
  const updateExpertiseQuery = `UPDATE expertise
                                  SET 
                                    domain = ?,
                                    specialistskills = ?,
                                    skillset = ?,
                                    Expertise_Completion = ?
                                  WHERE person_id = ?`;

  const insertQuery = `INSERT INTO expertise
                                  (person_id, domain, specialistskills, skillset, Expertise_Completion )
                                  VALUES (?, ?, ?, ?, ?)`;

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
    db.query(checkExpertiseQuery, [personId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error checking expertise" });
      }

      if (result.length > 0) {
        // If experience record exists, update it
        db.query(updateExpertiseQuery, [
          domain,
          specialistskills,
          skillset,
          completion,
          personId
        ], (err, updateResult) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error updating expertise" });
          }

          res.json({ message: "Expertise updated successfully", expertise: updateResult });
        });
      } else {
        // If no experience record exists, insert a new record
        db.query(insertQuery, [
          personId,
          domain,
          specialistskills,
          skillset,
          completion,
        ], (err, insertResult) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error inserting experience" });
          }

          res.json({ message: "Expertise added successfully", expertise: insertResult });
        });
      }
    });
  });
};

module.exports = { updateExpertise };
