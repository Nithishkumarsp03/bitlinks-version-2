const db = require("../../../db/config");

const adddomain = (req, res) => {
  const { domain_column } = req.body;
  const query = `INSERT INTO domain_table (domain_column) VALUES (?)`

  db.query(query, [domain_column], (err) => {
    if (err) {
        return res.status(400).json({ message: "Error adding domain" });
      }
    else{
        return res.status(200).json({message: "domain added"});
    }
  })
};

module.exports = { adddomain };
