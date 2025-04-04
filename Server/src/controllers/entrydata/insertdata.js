const db = require("../../db/config");

const insertData = (req, res) => {
  const { finalData } = req.body;
  // console.log(req.body);

  const query = `
        INSERT into entrydata (profile, guest_name, fullname, phonenumber, companyname, role, email, dob, designation, linkedinurl, visitingcard, rating, hashtags, address, purpose) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

  const values = [
    finalData.profilePhoto,
    finalData.name,
    finalData.fullname,
    finalData.phonenumber,
    finalData.companyname ? finalData.companyname.value : null,
    finalData.role ? finalData.role.value : null,
    finalData.email,
    finalData.dob,
    finalData.designation,
    finalData.linkedinurl,
    finalData.visitingCard || null,
    finalData.rating,
    finalData.hashtags,
    finalData.address,
    finalData.purpose,
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error in database" });
    } else {
      res.send({ message: "Data inserted successfully" });
    }
  });
};

module.exports = { insertData };
