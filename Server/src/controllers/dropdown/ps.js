const db = require("../../db/config");

const companyname = (req, res) => {
  db.query("SELECT * FROM company_table where status = 1", (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Error fetching company name" });
    }
    res.json(result);
  });
};

const role = (req, res) => {
  db.query("SELECT * FROM role_table where status = 1", (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Error fetching role" });
    }
    res.json(result);
  });
};

module.exports = { companyname, role };
