const db = require("../../../db/config");

const updatePerson = (req, res) => {
  const { finalData } = req.body;
  // console.log(req.body);

  const fetchSpoc = `SELECT email, person_id FROM personalinfo WHERE fullname = ?`;
  
  let updateQuery = `UPDATE personalinfo SET
                profile = ?,
                fullname = ?,
                phonenumber = ?,
                age = ?,
                email = ?,
                dob = ?,
                rating = ?,
                designation = ?,
                visitingcard = ?,
                linkedinurl = ?,
                address = ?,
                shortdescription = ?,
                hashtags = ?,
                completion = ?
            WHERE uuid = ?`;

  let updateParams = [
    finalData.profileImage,
    finalData.firstname,
    finalData.phonenumber,
    finalData.age,
    finalData.email,
    finalData.dob,
    finalData.rating,
    finalData.designation,
    finalData.visitingcard,
    finalData.linkedinurl,
    finalData.address,
    finalData.shortdescription,
    finalData.hashtags,
    finalData.completion,
    finalData.uuid,
  ];

  if (finalData.projectLeader) {
    // If projectLeader is not null, update useremail & sub_id
    updateQuery = `UPDATE personalinfo SET
                useremail = ?,
                sub_id = ?,
                profile = ?,
                fullname = ?,
                phonenumber = ?,
                age = ?,
                email = ?,
                dob = ?,
                rating = ?,
                designation = ?,
                visitingcard = ?,
                linkedinurl = ?,
                address = ?,
                shortdescription = ?,
                hashtags = ?,
                completion = ?
            WHERE uuid = ?`;

    db.query(fetchSpoc, [finalData.projectLeader], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Error fetching spoc" });
      }

      if (results.length > 0) {
        const email = results[0].email;
        const person_id = results[0].person_id;

        updateParams.unshift(email, person_id); // Add email & person_id at the start
      }

      db.query(updateQuery, updateParams, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "Error updating user" });
        }
        res.send({ message: "User updated successfully" });
      });
    });
  } else {
    // If projectLeader is null, do not update useremail & sub_id
    db.query(updateQuery, updateParams, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Error updating user" });
      }
      res.send({ message: "User updated successfully" });
    });
  }
};

module.exports = { updatePerson };
