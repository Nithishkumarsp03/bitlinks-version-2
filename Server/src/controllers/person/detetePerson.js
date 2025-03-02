const db = require("../../db/config");

const deletePerson = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Person ID is required" });
    }

    // Get a database connection from the pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        // Start a transaction
        connection.beginTransaction((transactionErr) => {
            if (transactionErr) {
                connection.release();
                console.error("Transaction error:", transactionErr);
                return res.status(500).json({ error: "Database transaction error" });
            }

            // List of tables to delete from
            const tables = [
                "alumni", "company", "consultancy", "expertise", "history",
                "internship", "minutes", "person_points_summary",
                "placement", "previousexperience", "projects"
            ];

            // Function to delete data from each table
            const deleteFromTable = (index) => {
                if (index >= tables.length) {
                    return connection.query("DELETE FROM personalinfo WHERE person_id = ?", [id], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error("Error deleting person:", err);
                                res.status(500).json({ error: "Error deleting person record" });
                            });
                        }

                        // Commit the transaction
                        connection.commit((commitErr) => {
                            if (commitErr) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error("Commit error:", commitErr);
                                    res.status(500).json({ error: "Database commit error" });
                                });
                            }

                            connection.release();
                            res.status(200).json({ message: "Person and related records deleted successfully" });
                        });
                    });
                }

                // Delete from the current table
                const table = tables[index];
                connection.query(`DELETE FROM ${table} WHERE person_id = ?`, [id], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error(`Error deleting from ${table}:`, err);
                            res.status(500).json({ error: `Error deleting records from ${table}` });
                        });
                    }
                    // Recursively delete from the next table
                    deleteFromTable(index + 1);
                });
            };

            // Start deleting from the first table
            deleteFromTable(0);
        });
    });
};

module.exports = { deletePerson };
