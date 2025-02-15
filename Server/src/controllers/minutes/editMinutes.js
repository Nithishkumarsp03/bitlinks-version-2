const db = require("../../db/config");

const editMinutes = (req, res) => {
  const { formValues } = req.body; 
//   console.log(req.body) 
  const query = `UPDATE minutes 
                    SET 
                    topic = ?, 
                    description = ?, 
                    initial_date = ?, 
                    due_date = ?, 
                    handler = ? 
                    WHERE 
                    id = ?`;
  const values = [
    formValues.topic,
    formValues.description,
    formValues.initialDate,
    formValues.dueDate,
    formValues.projectLeader, // Assuming "handler" corresponds to "projectLeader"
    formValues.id,
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.error("Error updating minutes", err);
      return res
        .status(500)
        .json({ error: "Failed to insert minutes to the database" });
    }

    res.status(200).json({ message: "updated Successfully" });
  });
};


const updateStatus = (req, res) => {
    const {id, status} = req.body
    const query = `UPDATE minutes set status = ? WHERE id = ?`

    db.query(query, [status, id], (err) => {
        if (err) {
            console.error("Error updating status", err);
            return res
              .status(500)
              .json({ error: "Failed to update minutes to the database" });
          }
        
          res.status(200).json({ message: "updated Successfully" });
    })
}

module.exports = { editMinutes, updateStatus };
