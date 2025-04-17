const db = require("../../../db/config");

const addcompany = (req, res) => {
    const { company_column } = req.body;
  const query = `INSERT INTO company_table (company_column) VALUES (?)`

  db.query(query, [company_column], (err) => {
    if (err) {
        return res.status(400).json({ message: "Error adding company" });
      }
    else{
        return res.status(200).json({message: "Company added"});
    }
  })
};

module.exports = { addcompany };
