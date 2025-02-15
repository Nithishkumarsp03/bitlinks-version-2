const db = require("../../db/config");

const fetchSpoc = (req, res) => {
  const query = "SELECT fullname from personalinfo WHERE spoc = 'yes'";

  db.query(query, (err, spocData) => {
    if (err) {
      console.error("Error fetching spoc", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch spoc from the database" });
    }

    res
      .status(200)
      .json({ message: "Fetched Successfully", spoc: spocData });
  });
};

module.exports = { fetchSpoc };
