const db = require("../../../db/config");

const updateAlumni = (req, res) => {
  const { updateAlumni } = req.body;
  // console.log(req.body);

  const getPersonIdQuery = `SELECT person_id FROM personalinfo WHERE uuid = ?`;
  const checkAlumniQuery = `SELECT * FROM alumni WHERE person_id = ?`;
  const updateAlumniQuery = `UPDATE alumni
                                  SET 
                                    name = ?,
                                    batch = ?,
                                    graduatedyear = ?,
                                    phonenumber = ?,
                                    companyaddress = ?,
                                    Alumni_Completion = ?
                                  WHERE person_id = ?`;

  const insertCompanyQuery = `INSERT INTO alumni
                                  (person_id, name, batch, graduatedyear, phonenumber, companyaddress, Alumni_Completion )
                                  VALUES (?, ?, ?, ?, ?, ?, ?)`;

  // Step 1: Get the person_id from the personalinfo table
  db.query(getPersonIdQuery, [updateAlumni.uuid], (err, person) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching person_id" });
    }

    if (person.length === 0) {
      return res.status(404).json({ message: "Person not found" });
    }

    const personId = person[0].person_id;

    // Step 2: Check if the person_id already exists in the previousexperience table
    db.query(checkAlumniQuery, [personId], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error checking experience" });
      }

      if (result.length > 0) {
        // If experience record exists, update it
        db.query(updateAlumniQuery, [
          updateAlumni.name,
          updateAlumni.batch,
          updateAlumni.graduatedyear,
          updateAlumni.phonenumber,
          updateAlumni.companyaddress ? updateAlumni.companyaddress.value : null,
          updateAlumni.completion,
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
          updateAlumni.name,
          updateAlumni.batch,
          updateAlumni.graduatedyear,
          updateAlumni.phonenumber,
          updateAlumni.companyaddress ? updateAlumni.companyaddress.value : null,
          updateAlumni.completion,
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

module.exports = { updateAlumni };
