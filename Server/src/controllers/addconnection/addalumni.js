const db = require("../../db/config");

const addAlumni = (req, res) => {
  const { finalData } = req.body;
  // console.log(finalData);

  const personvalues = [
    finalData.personalInfo.useremail,
    finalData.personalInfo.name,
    finalData.personalInfo.email,
    finalData.personalInfo.phone,
    finalData.personalInfo.age,
    finalData.personalInfo.dob,
    finalData.additionalInfo.rating,
    "alumni",
    finalData.professionalInfo.visitingCard,
    finalData.personalInfo.profilePhoto || "/uploads/1738045401481-user.jpg",
    finalData.personalInfo.shortDescription,
    finalData.personalInfo.address,
  ];

  const personquery = `
    INSERT INTO personalinfo (useremail,fullname, email, phonenumber, age, dob, rating, designation, visitingcard, profile, shortdescription, address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Insert into personalinfo first
  db.query(personquery, personvalues, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Contact already exists in the database" });
      }
      console.error("Error inserting into personalinfo:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const personId = result.insertId; // Get inserted person's ID

    // Conditionally insert into company table
    if (finalData.professionalInfo.company || finalData.personalInfo.role || finalData.professionalInfo.experience || finalData.professionalInfo.location || finalData.additionalInfo.website) {
      const companyvalues = [
        personId,
        finalData.professionalInfo.company ? finalData.professionalInfo.company.value : "",
        finalData.personalInfo.role ? finalData.personalInfo.role.value : "",
        finalData.professionalInfo.experience,
        finalData.professionalInfo.location ? finalData.professionalInfo.location.value : "",
        finalData.additionalInfo.website,
      ];

      const companyquery = `
        INSERT INTO company (person_id, companyname, role, experience, companyaddress, websiteurl) 
        VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(companyquery, companyvalues, (err) => {
        if (err) console.error("Error inserting into company:", err);
      });
    }

    // Conditionally insert into alumni table
    if (finalData.additionalInfo.batch || finalData.additionalInfo.graduatedYear || finalData.professionalInfo.company) {
      const alumnivalues = [
        personId,
        finalData.personalInfo.name,
        finalData.additionalInfo.batch,
        finalData.additionalInfo.graduatedYear,
        finalData.personalInfo.phone,
        finalData.professionalInfo.company ? finalData.professionalInfo.company.value : "",
      ];

      const alumniquery = `
        INSERT INTO alumni (person_id, name, batch, graduatedyear, phonenumber, companyaddress) 
        VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(alumniquery, alumnivalues, (err) => {
        if (err) console.error("Error inserting into alumni:", err);
      });
    }

    // Conditionally insert into spouse table
    if (finalData.spouse.name || finalData.spouse.email || finalData.spouse.phone || finalData.spouse.occupation || finalData.spouse.company || finalData.spouse.dob) {
      const spousevalues = [
        personId,
        finalData.spouse.name,
        finalData.spouse.email,
        finalData.spouse.phone,
        finalData.spouse.occupation,
        finalData.spouse.company ? finalData.spouse.company.value : "",
        finalData.spouse.dob,
      ];

      const spousequery = `
        INSERT INTO spouse (person_id, name, email, phonenumber, occupation, companyname, dob) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(spousequery, spousevalues, (err) => {
        if (err) console.error("Error inserting into spouse:", err);
      });
    }

    const summary = `INSERT INTO person_points_summary (person_id, \`rank\`, last_updated) VALUES (${personId}, 0, NOW())`;
    db.query(summary, (err) => {
        if (err) console.error("Error inserting into spouse:", err);
    });

    res.status(200).json({ message: "Alumni added successfully" });
  });
};

module.exports = { addAlumni };
