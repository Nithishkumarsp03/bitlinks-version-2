var fs = require('fs');
var csv = require('csv-parser');
var mysql = require('mysql2');

// Create a connection pool.
var pool = mysql.createPool({
  connectionLimit: 10,
  host: '10.30.10.21',
  user: 'nithish',
  password: 'Qwertyuiop@2005',
  database: 'bitlinks'
});

// Process a single row from the CSV.
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

      // Step 1: Fetch SPOC details using the spoc column value.
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
          // If no SPOC is found, use fallback values.
          if (spocRows.length === 0) {
            spocEmail = "iecc@bitsathy.ac.in";
            spocPersonId = 1270;
          } else {
            spocEmail = spocRows[0].email;
            spocPersonId = spocRows[0].person_id;
          }

          // Step 2: Insert the primary person record.
          // If a duplicate entry error occurs, skip the row.
          connection.query(
            "INSERT INTO personalinfo (useremail, profile, fullname, phonenumber, age, email, dob, rating, designation, visitingcard, linkedinurl, address, shortdescription, hashtags, spoc, sub_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              spocEmail,            // useremail fetched from SPOC lookup or fallback
              row.profile,          // profile
              row.fullname,         // fullname
              row.phonenumber,      // phonenumber
              row.age,              // age
              row.email,            // email
              row.dob,              // dob
              row.rating,           // rating
              row.designation,      // designation
              row.visitingcard,     // visitingcard
              row.linkedinurl,      // linkedinurl
              row.address,          // address
              row.shortdescription, // shortdescription
              row.hashtags,         // hashtags
              "no",                 // spoc (set to "no" as per your logic)
              spocPersonId          // sub_id from SPOC lookup or fallback
            ],
            function (err, personResult) {
              if (err) {
                // Check if error is a duplicate entry error.
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

              // Step 3: Insert company data.
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

                  // Step 4: Insert expertise data.
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

                      // Step 5: Insert rank into person_points_summary.
                      // The reserved keyword "rank" is escaped using backticks.
                      connection.query(
                        "INSERT INTO person_points_summary (person_id, `rank`, last_updated) VALUES (?, ?, NOW())",
                        [
                          personId,
                          Number(row.rank)
                        ],
                        function (err, rankResult) {
                          if (err) {
                            return connection.rollback(function () {
                              connection.release();
                              return callback(err);
                            });
                          }
                          // Commit the transaction.
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
                      ); // End insert into person_points_summary.
                    }
                  ); // End expertise insert.
                }
              ); // End company insert.
            }
          ); // End personalinfo insert.
        }
      ); // End SPOC query.
    }); // End beginTransaction.
  }); // End getConnection.
}

// Process all rows from the CSV (one by one).
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

// Read CSV file and convert it to an array of objects.
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

// Specify the path to your CSV file.
var csvFilePath = "./data.csv";

// Read the CSV and start processing.
readCsvFile(csvFilePath, function (err, rows) {
  if (err) {
    return console.error("Error reading CSV file:", err);
  }
  console.log("Fetched " + rows.length + " rows from the CSV file.");
  processAllRows(rows, 0);
});
