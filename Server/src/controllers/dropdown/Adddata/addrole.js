const db = require("../../../db/config");

const addrole = (req, res) => {
    const { role_column } = req.body;
  const query = `INSERT INTO role_table (role_column) VALUES (?)`

  db.query(query, [role_column], (err) => {
    if (err) {
        return res.status(400).json({ message: "Error adding role" });
      }
    else{
        return res.status(200).json({message: "role added"});
    }
  })
};

module.exports = { addrole };
