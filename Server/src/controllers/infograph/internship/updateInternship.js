const db = require("../../../db/config");

const updateInternship = (req, res) => {
  const { updateInternship } = req.body;
  console.log(req.body);

  const getPersonIdQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const checkCompanyQuery = `SELECT * FROM internship WHERE person_id = ?`;
  const updateExperienceQuery = `UPDATE internship
                                  SET 
                                    ifinternship = ?,
                                    role = ?,
                                    domain = ?,
                                    skillset = ?,
                                    eligibility = ?,
                                    projecttype = ?,
                                    Internship_Completion = ?
                                  WHERE person_id = ?`;

  const insertCompanyQuery = `INSERT INTO internship
                                  (person_id, ifinternship, role, domain, skillset, eligibility, projecttype, Internship_Completion )
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Step 1: Get the person_id from the personalinfo table
  db.query(getPersonIdQuery, [updateInternship.uuid], (err, person) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching person_id" });
    }

    if (person.length === 0) {
      return res.status(404).json({ message: "Person not found" });
    }

    const personId = person[0].person_id;

    // Step 2: Check if the person_id already exists in the previousexperience table
    db.query(checkCompanyQuery, [personId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error checking experience" });
      }

      if (result.length > 0) {
        // If experience record exists, update it
        db.query(updateExperienceQuery, [
          updateInternship.internship,
          updateInternship.role ? updateInternship.role.value : null,
          updateInternship.domain,
          updateInternship.skillset,
          updateInternship.eligibility,
          updateInternship.projecttype,
          updateInternship.completion,
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
        db.query(insertCompanyQuery, [
          personId,
          updateInternship.internship,
          updateInternship.role ? updateInternship.role.value : null,
          updateInternship.domain,
          updateInternship.skillset,
          updateInternship.eligibility,
          updateInternship.projecttype,
          updateInternship.completion,
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

module.exports = { updateInternship };
