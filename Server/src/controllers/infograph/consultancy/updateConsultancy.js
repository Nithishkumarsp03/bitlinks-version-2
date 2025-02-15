const db = require("../../../db/config");

const updateConsultancy = (req, res) => {
  const { consultancyUpdate } = req.body;
  // console.log(req.body);

  const getPersonIdQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const checkCompanyQuery = `SELECT * FROM consultancy WHERE person_id = ?`;
  const updateExperienceQuery = `UPDATE consultancy
                                  SET 
                                    ifconsultancy = ?,
                                    role = ?,
                                    domain = ?,
                                    skillset = ?,
                                    eligibility = ?,
                                    projecttype = ?,
                                    Consultancy_Completion = ?
                                  WHERE person_id = ?`;

  const insertCompanyQuery = `INSERT INTO consultancy
                                  (person_id, ifconsultancy, role, domain, skillset, eligibility, projecttype, Consultancy_Completion )
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  // Step 1: Get the person_id from the personalinfo table
  db.query(getPersonIdQuery, [consultancyUpdate.uuid], (err, person) => {
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
          consultancyUpdate.consultancy,
          consultancyUpdate.role ? consultancyUpdate.role.value : null,
          consultancyUpdate.domain,
          consultancyUpdate.skillset,
          consultancyUpdate.eligibility,
          consultancyUpdate.projecttype,
          consultancyUpdate.completion,
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
          consultancyUpdate.consultancy,
          consultancyUpdate.role ? consultancyUpdate.role.value : null,
          consultancyUpdate.domain,
          consultancyUpdate.skillset,
          consultancyUpdate.eligibility,
          consultancyUpdate.projecttype,
          consultancyUpdate.completion,
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

module.exports = { updateConsultancy };
