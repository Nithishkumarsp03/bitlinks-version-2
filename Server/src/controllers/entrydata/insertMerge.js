const db = require("../../db/config");

const insertMerge = (req, res) => {
  const { mergedData, mergedIds, formValues } = req.body;
  console.log("Request Body:", req.body);

  // Initialize variables
  let spocPersonId = null;
  let spocEmail = null;

  // Fetch projectLeader details first (if provided)
  if (formValues.projectLeader) {
    db.query(
      `SELECT email, person_id FROM personalinfo WHERE fullname = ?`,
      [formValues.projectLeader],
      (err, spocResult) => {
        if (err) {
          console.error("Error fetching SPOC details:", err);
          return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (spocResult.length > 0) {
          spocPersonId = spocResult[0].person_id;
          spocEmail = spocResult[0].email;
        } else {
          console.warn("Project Leader not found:", formValues.projectLeader);
        }

        // Now, insert mergedData into personalinfo table
        const values = [
          spocEmail || "", // Ensure email is not undefined
          mergedData.profile,
          mergedData.fullname,
          mergedData.phonenumber,
          mergedData.email,
          mergedData.linkedinurl,
          mergedData.dob,
          mergedData.designation,
          mergedData.visitingcard,
          mergedData.rating,
          mergedData.hashtags,
          mergedData.address,
          mergedData.purpose || "",
          spocPersonId
        ];

        db.query(
          `INSERT INTO personalinfo 
            (useremail, profile, fullname, phonenumber, email, linkedinurl, dob, designation, visitingcard, rating, hashtags, address, shortdescription, sub_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          values,
          (err, insertResult) => {
            if (err) {
              console.error("Error inserting personalinfo:", err);
              return res.status(500).json({ message: "Database error", error: err.message });
            }

            const insertId = insertResult.insertId;
            console.log("Inserted into personalinfo with ID:", insertId);

            if(mergedData.companyname || mergedData.role){
              db.query(`INSERT INTO company (person_id, companyname, role) values (?,?,?)`,
                [insertId, mergedData.companyname, mergedData.role],
                (err) => {
                  if (err) console.error("Error inserting into company:", err);
                }
              )
            }

            // If spocPersonId exists, insert into person_points_summary
            if (spocPersonId !== null) {
              db.query(
                `INSERT INTO person_points_summary (person_id, \`rank\`, last_updated) VALUES (?, ?, NOW())`,
                [insertId, formValues.rank],
                (err) => {
                  if (err) console.error("Error inserting into person_points_summary:", err);
                }
              );
            }

            // Update each merged entry's status in entrydata table
            mergedIds.forEach((id) => {
              db.query(
                `UPDATE entrydata SET status = 'approved' WHERE temp_id = ?`,
                [id],
                (err) => {
                  if (err) console.error(`Error updating entrydata for ID ${id}:`, err);
                }
              );
            });

            // Send response after all queries execute
            res.status(200).json({ 
              message: "Merge successful", 
              insertId, 
              mergedIds, 
              spocPersonId 
            });
          }
        );
      }
    );
  } else {
    return res.status(400).json({ message: "Project Leader is required" });
  }
};

module.exports = { insertMerge };
