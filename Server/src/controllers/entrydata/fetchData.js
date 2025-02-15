const db = require("../../db/config");

const fetchdata = (req, res) => {
  const query = `SELECT * FROM entrydata WHERE status = 'pending'`;

  db.query(query, (err, person) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error in database" });
    } else {
      res.send({ message: "Data fetched", contact: person });
    }
  });
};

module.exports = { fetchdata };
