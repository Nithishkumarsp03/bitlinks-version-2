const db = require("../../db/config");

const fetchDomain = (req, res) => {
  const query = "SELECT * FROM domain_table";

  db.query(query, (err, domainData) => {
    if (err) {
      console.error("Error fetching domain", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch domain from the database" });
    }

    res
      .status(200)
      .json({ message: "Fetched Successfully", domain: domainData });
  });
};

module.exports = { fetchDomain };
