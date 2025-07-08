var fs = require('fs');
var csv = require('csv-parser');
var mysql = require('mysql2');

// Create a connection pool
var pool = mysql.createPool({
  connectionLimit: 10,
  host: '10.30.10.21',
  user: 'nithish',
  password: 'Qwertyuiop@2005',
  database: 'bitlinks'
});

// Helper to safely handle NaN, undefined, empty string
function safeValue(value) {
  if (value === undefined || value === null || value === '' || value === 'NaN') {
    return null;
  }
  return value;
}

// Process a single row
function processRow(row, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error getting connection:', err);
      return callback(err);
    }

    connection.beginTransaction(function (err) {
      if (err) {
        connection.release();
        return callback(err);
      }

      // Step 1: Fetch SPOC details
      connection.query(
        "SELECT email, person_id FROM personalinfo WHERE fullname = ? LIMIT 1",
        [row.spoc],
        function (err, spocRows) {
          if (err) {
            return connection.rollback(function () {
              connection.release();
              return callback(err);
            });
          }

          var spocEmail, spocPersonId;
          if (spocRows.length === 0) {
            spocEmail = "iecc@bitsathy.ac.in";
            spocPersonId = 1270;
          } else {
            spocEmail = spocRows[0].email;
            spocPersonId = spocRows[0].person_id;
          }

          // Step 2: Insert personalinfo
          connection.query(
            "INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, dob, rating, designation, visitingcard, linkedinurl, address, shortdescription, hashtags, spoc, sub_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              spocEmail,
              row.profile,
              safeValue(row.fullname),
              row.phonenumber,
              row.age,
              row.email,
              row.dob,
              row.rating,
              row.designation,
              row.visitingcard,
              row.linkedinurl,
              row.address,
              row.shortdescription,
              row.hashtags,
              "no",
              spocPersonId
            ],
            function (err, personResult) {
              if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                  console.log("Duplicate entry for email: " + row.email + ". Skipping row.");
                  return connection.rollback(function () {
                    connection.release();
                    return callback(null);
                  });
                } else {
                  return connection.rollback(function () {
                    connection.release();
                    return callback(err);
                  });
                }
              }

              var personId = personResult.insertId;

              // Step 3: Insert company
              connection.query(
                "INSERT INTO company (person_id, companyname, position, experience, role, companyaddress, websiteurl, scale, payscale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  personId,
                  row.companyname,
                  row.position,
                  row.experience,
                  row.role,
                  row.companyaddress,
                  row.websiteurl,
                  row.scale,
                  row.payscale
                ],
                function (err, companyResult) {
                  if (err) {
                    return connection.rollback(function () {
                      connection.release();
                      return callback(err);
                    });
                  }

                  // Step 4: Insert expertise
                  connection.query(
                    "INSERT INTO expertise (person_id, domain, specialistskills, skillset) VALUES (?, ?, ?, ?)",
                    [
                      personId,
                      row.domain,
                      row.specialistskills,
                      row.skillset
                    ],
                    function (err, expertiseResult) {
                      if (err) {
                        return connection.rollback(function () {
                          connection.release();
                          return callback(err);
                        });
                      }

                      // Step 5: Insert into person_points_summary
                      connection.query(
                        "INSERT INTO person_points_summary (person_id, `rank`, last_updated) VALUES (?, 0, NOW())",
                        [
                          personId,
                          safeValue(row.rank)
                        ],
                        function (err, rankResult) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release();
                              return callback(err);
                            });
                          }

                          // All inserts done! Commit
                          connection.commit(function (err) {
                            if (err) {
                              return connection.rollback(function () {
                                connection.release();
                                return callback(err);
                              });
                            }
                            console.log("Row processed successfully. Inserted person_id:", personId);
                            connection.release();
                            callback(null);
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}

// Process all rows
function processAllRows(rows, index) {
  if (index >= rows.length) {
    console.log("All rows processed");
    return;
  }
  processRow(rows[index], function (err) {
    if (err) {
      console.error("Error processing row:", err.message);
    }
    processAllRows(rows, index + 1);
  });
}

// Read CSV file
function readCsvFile(filePath, callback) {
  var results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", function (data) {
      results.push(data);
    })
    .on("end", function () {
      callback(null, results);
    })
    .on("error", function (err) {
      callback(err);
    });
}

// Path to your CSV
var csvFilePath = "./datanew.csv";

// Start
readCsvFile(csvFilePath, function (err, rows) {
  if (err) {
    return console.error("Error reading CSV file:", err);
  }
  console.log("Fetched " + rows.length + " rows from the CSV file.");
  processAllRows(rows, 0);
});
