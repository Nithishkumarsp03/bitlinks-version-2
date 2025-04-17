const db = require("../../../db/config");

const addlocation = (req, res) => {
  const { address_column } = req.body;
  const query = `INSERT INTO address_table (address_column) VALUES (?)`

  db.query(query, [address_column], (err) => {
    if (err) {
        return res.status(400).json({ message: "Error adding location" });
      }
    else{
        return res.status(200).json({message: "location added"});
    }
  })
};

module.exports = { addlocation };
