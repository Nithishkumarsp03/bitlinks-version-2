const db = require("../../db/config");

exports.generateReport = (req, res) => {
  const { company, staffname, dateRange } = req.query;

  let sql = `
    SELECT 
      p.profile, p.fullname, p.email, p.person_id,
      c.companyname, c.companyaddress, c.websiteurl,
      h.history_id, h.agent, h.type, h.note, h.purpose, h.datetime, h.points, h.created_at AS history_created, h.visited1, h.visited2, h.updated_at AS history_updated,
      m.id AS minutes_id, m.topic, m.description, m.initial_date, m.status, m.due_date, m.created_at AS minutes_created, m.updated_at AS minutes_updated
    FROM personalinfo p
    INNER JOIN company c ON p.person_id = c.person_id
    INNER JOIN history h ON p.person_id = h.person_id AND h.type = "Visited"
    INNER JOIN minutes m ON p.person_id = m.person_id AND m.status = "Approved"
    WHERE 1=1`; // Default WHERE condition for flexible filtering

  let values = [];

  if (company) {
    sql += " AND c.companyname = ?";
    values.push(company);
  }

  if (staffname) {
    sql += " AND (h.agent = ? OR m.handler = ?)";
    values.push(staffname, staffname);
  }

  if (dateRange) {
    sql += ` AND (
      h.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) OR h.updated_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      OR m.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) OR m.updated_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    )`;
    values.push(dateRange, dateRange, dateRange, dateRange);
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching report data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};
