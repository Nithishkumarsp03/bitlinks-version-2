const db = require('../../db/config');

const fetchConnectionsRank = (req, res) => {
    const { email } = req.body;

    const query = `
        SELECT 
            SUM(CASE WHEN \`rank\` = -1 THEN 1 ELSE 0 END) AS rank_minus,
            SUM(CASE WHEN \`rank\` = 0 THEN 1 ELSE 0 END) AS rank_zero,
            SUM(CASE WHEN \`rank\` = 1 THEN 1 ELSE 0 END) AS rank_one,
            SUM(CASE WHEN \`rank\` = 2 THEN 1 ELSE 0 END) AS rank_two,
            SUM(CASE WHEN \`rank\` = 3 THEN 1 ELSE 0 END) AS rank_three,
            SUM(CASE WHEN personalinfo.status = 0 THEN 1 ELSE 0 END) AS inactive
        FROM person_points_summary
        INNER JOIN personalinfo ON person_points_summary.person_id = personalinfo.person_id
        WHERE personalinfo.useremail = ?;
    `;

    db.query(query, [email], (error, results) => {
        if (error) {
            console.error('Error fetching connection ranks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results[0]); // Send the first row as a JSON response
    });
};

const fetchNetworksrank = (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN \`rank\` = -1 THEN 1 ELSE 0 END) AS rank_minus,
            SUM(CASE WHEN \`rank\` = 0 THEN 1 ELSE 0 END) AS rank_zero,
            SUM(CASE WHEN \`rank\` = 1 THEN 1 ELSE 0 END) AS rank_one,
            SUM(CASE WHEN \`rank\` = 2 THEN 1 ELSE 0 END) AS rank_two,
            SUM(CASE WHEN \`rank\` = 3 THEN 1 ELSE 0 END) AS rank_three,
            SUM(CASE WHEN personalinfo.status = 0 THEN 1 ELSE 0 END) AS inactive
        FROM person_points_summary
        INNER JOIN personalinfo ON person_points_summary.person_id = personalinfo.person_id;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching connection ranks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results[0]); // Send the first row as a JSON response
    });
}

module.exports = { fetchConnectionsRank, fetchNetworksrank };
