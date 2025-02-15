const db = require("../../db/config");

const fetchdata = (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ message: "id is required" });
  }

  // Query to fetch the main person and their sub-connections
  const query = `
    SELECT 
      p1.uuid AS person_uuid,
      p1.person_id AS main_person_id,
      p1.fullname AS main_person_name,
      p1.address AS main_person_address,
      p3.rank AS main_person_rank,
      p1.profile AS main_person_profile,
      p2.uuid AS sub_person_uuid,
      p2.person_id AS sub_person_id,
      p2.fullname AS sub_person_name,
      p2.address AS sub_person_address,
      p3.rank AS sub_person_rank,
      p2.profile AS sub_person_profile
    FROM personalinfo p1
    LEFT JOIN person_points_summary p3 ON p3.person_id = p1.person_id
    LEFT JOIN personalinfo p2 ON p2.sub_id = p1.person_id
    WHERE p1.uuid = ?
  `;

  db.query(query, [uuid], (err, results) => {
    if (err) {
      console.error("Fetching error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with this id" });
    }

    // Extract main person details
    const mainPerson = {
      uuid: results[0].person_uuid,
      person_id: results[0].main_person_id,
      fullname: results[0].main_person_name,
      address: results[0].main_person_address,
      rank: results[0].main_person_rank,
      profile: results[0].main_person_profile,
    };

    // Extract sub-connections details
    const subConnections = results
      .filter((row) => row.sub_person_id) // Only include rows where a sub-connection exists
      .map((row) => ({
        uuid: row.sub_person_uuid,
        person_id: row.sub_person_id,
        fullname: row.sub_person_name,
        address: row.sub_person_address,
        rank: row.sub_person_rank,
        profile: row.sub_person_profile,
      }));

    // Respond with structured data
    res.status(200).json({
      mainPerson,
      subConnections,
    });
  });
};

module.exports = { fetchdata };
