// App.js
/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This application's codebase is primarily adapted from the CS 340 starter code 
    (source: https://github.com/osu-cs340-ecampus/nodejs-starter-app, accessed on 11/14/23). Modifications and 
    extensions have been made to suit the specific requirements of our project. 

    Key areas of adaptation and original work are as follows:

    - Express Setup and Middleware Configuration: 
      Adapted from CS 340 starter code (source: https://github.com/osu-cs340-ecampus/nodejs-starter-app, accessed on 11/14/23). 
      Minor modifications for project-specific settings.

    - Database Connection and Queries:
      Based on patterns provided in the CS 340 starter code (source: https://github.com/osu-cs340-ecampus/nodejs-starter-app, accessed on 11/14/23). 
      Queries and database interactions have been customized and extended for additional functionality.

    - Route Handling and API Endpoints:
      The structure for route handling is adapted from the CS 340 starter code (source: https://github.com/osu-cs340-ecampus/nodejs-starter-app, accessed on 11/14/23). 
      However, specific endpoints and their logic, especially those handling more complex requests, 
      are entirely our own work.

    - Handlebars Integration and Templating:
      Integration setup follows the CS 340 starter code (source: https://github.com/osu-cs340-ecampus/nodejs-starter-app, accessed on 11/14/23) 
      with modifications for custom templates and partials, which are our original work.

    - Error Handling and Security Considerations:
      Basic patterns follow the CS 340 starter code (source: https://github.com/osu-cs340-ecampus/nodejs-starter-app, accessed on 11/14/23), 
      with enhancements and additional checks introduced by our team for improved security and error reporting.

    - Front-end Interaction (AJAX Calls, Dynamic Content Loading):
      Entirely our own work, demonstrating our team's ability to create responsive and interactive web interfaces.

    - Additional Features (e.g., advanced search, custom reports):
      Conceptualized and implemented by our team, demonstrating originality and creativity beyond 
      the scope of the CS 340 starter code.

    For any portion of the code directly taken from external sources outside of the CS 340 starter code, 
    specific citations are provided at the relevant sections within the code.

    ---------------------------------
    END OF CITATIONS
*/
/*
    SETUP
*/

// Import necessary libraries and modules
var express = require('express');   // Import the Express framework for creating the web server
var app     = express();            // Create an instance of the Express application

// Middleware setup
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 9132;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

////////////////////////// INDEX PAGE  ////////////////////////////
app.get('/index.hbs', function(req, res) {
    res.render('index.hbs');  // Render the 'index.hbs' view located in the 'views' directory
});

/*
    VIEW EQUIPMENT TRANSACTIONS PAGE
*/

// Route to display the View Equipment Transactions Page
app.get('/view-equipment-transactions.hbs', function(req, res) {
    // SQL query to retrieve equipment transaction data
    let query = `
        SELECT et.equipmentTransactionID, et.equipmentID, et.statusID, et.transactionDate, 
               e.barcode as equipmentBarcode, s.statusName 
        FROM EquipmentTransactions et
        JOIN Equipments e ON et.equipmentID = e.equipmentID
        JOIN Statuses s ON et.statusID = s.statusID;
    `;

    // Execute the SQL query and handle the response
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('SQL error', error);
            res.sendStatus(500); // Send a 500 Internal Server Error response
        } else {
            res.render('view-equipment-transactions', { transactions: rows }); // Render the view with transaction data
        }
    });
});

// Route to fetch all unique barcodes (AJAX GET)
app.get('/get-all-barcodes', function(req, res) {
    // SQL query to retrieve all unique barcodes from the Equipments table
    let query = "SELECT DISTINCT barcode FROM Equipments;";

    // Execute the SQL query and handle the response
    db.pool.query(query, function(error, rows) {
        if (error) {
            console.error('Error fetching barcodes:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json(rows); // Send the retrieved barcodes as a JSON response
        }
    });
});

// Route to fetch transactions by barcode (AJAX GET)
app.get('/get-transactions-by-barcode/:barcode', function(req, res) {
    const barcode = req.params.barcode;
    // SQL query to retrieve transactions by a specific barcode
    let query = `
        SELECT et.equipmentTransactionID, et.transactionDate, s.statusName, e.barcode 
        FROM EquipmentTransactions et
        JOIN Equipments e ON et.equipmentID = e.equipmentID
        JOIN Statuses s ON et.statusID = s.statusID
        WHERE e.barcode = ?;
    `;

    // Execute the SQL query with the provided barcode parameter and handle the response
    db.pool.query(query, [barcode], function(error, rows) {
        if (error) {
            console.error('Error fetching transactions by barcode:', error);
            res.status(500).json({ message: 'Internal Server Error' }); // Send a JSON response
        } else {
            res.json(rows); // Send the retrieved transactions as a JSON response
        }
    });
});


/*
    MANAGE EQUIPMENT TRANSACTIONS PAGE
*/

// Route to display the Manage Equipment Transactions Page
app.get('/manage-equipment-transactions.hbs', function(req, res) {
    // SQL query to retrieve equipment transactions and related information
    let query = `
        SELECT et.equipmentTransactionID, et.equipmentID, et.statusID, et.transactionDate, 
               e.barcode as equipmentBarcode, s.statusName 
        FROM EquipmentTransactions et
        JOIN Equipments e ON et.equipmentID = e.equipmentID
        JOIN Statuses s ON et.statusID = s.statusID;
    `;

    // Execute the SQL query and handle the response
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('SQL error', error);
            res.sendStatus(500); // Send a 500 Internal Server Error response
        } else {
            res.render('manage-equipment-transactions', { transactions: rows });
        }
    });
});


// Route to fetch all transactions (AJAX GET)
app.get('/get-transactions-ajax', function(req, res) {
    console.log("Fetching all transactions..."); // Log a message indicating the start of transaction retrieval

    // SQL query to retrieve all transactions from the EquipmentTransactions table
    let query = "SELECT * FROM EquipmentTransactions;";

    // Execute the SQL query and handle the response
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('Error fetching transactions:', error); // Log an error message if there was an error
            res.status(500).json({ message: 'Internal Server Error' }); // Send a JSON response with an error message
        } else {
            console.log("Transactions fetched successfully:", rows); // Log a message indicating the successful retrieval of transactions
            res.json(rows); // Send all transactions as a JSON response
        }
    });
});


// Route to fetch a specific transaction ID (AJAX GET)
app.get('/get-transactions-ajax/:id', function(req, res) {
    const transactionID = req.params.id;
    // SQL query to retrieve a specific transaction by its equipmentTransactionID
    let query = "SELECT * FROM EquipmentTransactions WHERE equipmentTransactionID = ?";

    // Execute the SQL query with the provided transactionID parameter and handle the response
    db.pool.query(query, [transactionID], function(error, rows, fields) {
        if (error) {
            console.error('Error fetching transaction:', error); // Log an error message if there was an error
            res.status(500).json({ message: 'Internal Server Error' }); // Send a JSON response with an error message
        } else {
            if (rows.length > 0) {
                res.json(rows[0]); // Send the specific transaction as JSON response
            } else {
                res.status(404).json({ message: 'Transaction not found' }); // Send a 404 response if the transaction is not found
            }
        }
    });
});

// Route to fetch all status options (AJAX GET)
app.get('/get-statuses-ajax', function(req, res) {
    console.log("Fetching all statuses..."); // Log a message indicating the start of status retrieval

    // SQL query to retrieve all status options with their IDs and names
    let query = "SELECT statusID, statusName FROM Statuses;";

    // Execute the SQL query and handle the response
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('Error fetching statuses:', error); // Log an error message if there was an error
            res.status(500).json({ message: 'Internal Server Error' }); // Send a JSON response with an error message
        } else {
            console.log("Statuses fetched successfully:", rows); // Log a success message indicating the successful retrieval of statuses
            res.json(rows); // Send all statuses as a JSON response
        }
    });
});


// Route to fetch all equipment with their IDs and barcodes (AJAX GET)
app.get('/get-equipments-ajax', function(req, res) {
    console.log("Fetching all equipments with barcodes..."); // Log a message indicating the start of equipment retrieval

    // SQL query to retrieve all equipment records with their IDs and barcodes
    let query = "SELECT equipmentID, barcode FROM Equipments;";

    // Execute the SQL query and handle the response
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('Error fetching equipments:', error); // Log an error message if there was an error
            res.status(500).json({ message: 'Internal Server Error' }); // Send a JSON response with an error message
        } else {
            console.log("Equipments fetched successfully:", rows); // Log a success with retrieved equipment
            res.json(rows); // Send all equipments as a JSON response
        }
    });
});


// Route to add a new transaction (AJAX POST)
app.post('/add-transaction-ajax', function(req, res) {
    const { equipmentID, statusID, transactionDate } = req.body;
    // SQL query to insert a new transaction into the EquipmentTransactions table
    let query = "INSERT INTO EquipmentTransactions (equipmentID, statusID, transactionDate) VALUES (?, ?, ?)";

    // Execute the SQL query with provided transaction data and handle the response
    db.pool.query(query, [equipmentID, statusID, transactionDate], function(error, result) {
        if (error) {
            console.error('Error adding transaction', error); // Log an error message if there was an error
            res.sendStatus(500);
        } else {
            res.status(201).json({ message: 'Transaction added successfully' }); // Send a 201 Created response with a success message
        }
    });
});

// Route to update a transaction (AJAX PUT)
app.put('/update-transaction-ajax/:id', function(req, res) {
    const transactionID = req.params.id;
    const { equipmentID, statusID, transactionDate } = req.body;
    // SQL query to update an existing transaction in the EquipmentTransactions table
    let query = "UPDATE EquipmentTransactions SET equipmentID = ?, statusID = ?, transactionDate = ? WHERE equipmentTransactionID = ?";

    // Execute the SQL query with provided transaction data and handle the response
    db.pool.query(query, [equipmentID, statusID, transactionDate, transactionID], function(error, result) {
        if (error) {
            console.error('Error updating transaction', error); // Log an error message if there was an error
            res.sendStatus(500); // Send a 500 Internal Server Error response
        } else {
            res.status(200).json({ message: 'Transaction updated successfully' }); // Send a 200 OK response with a success message
        }
    });
});


// Route to delete a transaction (AJAX DELETE)
app.delete('/delete-transaction-ajax/:equipmentTransactionID', function(req, res) {
    const equipmentTransactionID = req.params.equipmentTransactionID;
    // SQL query to delete a transaction by its equipmentTransactionID
    let query = "DELETE FROM EquipmentTransactions WHERE equipmentTransactionID = ?";

    // Execute the SQL query with the provided equipmentTransactionID parameter and handle the response
    db.pool.query(query, [equipmentTransactionID], function(error, result) {
        if (error) {
            console.error('Error deleting transaction', error); // Log an error message if there was an error
            res.sendStatus(500); // Send a 500 Internal Server Error response
        } else {
            res.status(200).json({ message: 'Transaction deleted successfully' }); // Send a 200 OK response with a success message
        }
    });
});




////////////////////////// MANAGE EQUIPMENTS PAGE ////////////////////////////

// Route to display the Manage Equipments Page
app.get('/manage-equipments.hbs', function(req, res) {
        // Declare Query 1: Retrieve equipment data including ID, barcode, timestamp, and equipment type name
        let query1 = "SELECT equipmentID, barcode, serializationTimestamp, equipmentTypeName FROM Equipments JOIN EquipmentTypes on Equipments.equipmentTypeID = EquipmentTypes.equipmentTypeID;";

        // Query 2 gets info from EquipmentTypes
        let query2 = "SELECT * FROM EquipmentTypes;";

    
        // Run the 1st query to fetch equipment data
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the equipment data
            let equipments = rows;
            
            // Run the second query to fetch equipment types
            db.pool.query(query2, (error, rows, fields) => {
                
                // Save the equipment types
                let equipmentTypes = rows;

                // Render the 'manage-equipments' page with the equipment and equipment type data
                return res.render('manage-equipments', {data: equipments, equipmentTypes: equipmentTypes});
                
            })
        })
});
                                                  

// Route to fetch equipment by equipment ID (AJAX GET)
app.get('/get-equipment/:equipmentID', function(req, res) {
    const equipmentID = req.params.equipmentID;

    // SQL query to retrieve equipment data based on the equipmentID parameter
    let query = `SELECT * FROM Equipments WHERE equipmentID = ?`;

    // Execute the SQL query with the provided equipmentID and handle the response
    db.pool.query(query, [equipmentID], function(error, rows, fields) {
        if (error) {
            console.error('Error fetching equipment:', error); // Log an error message if there was an error
            res.status(500).send('Internal Server Error'); // Send a 500 Internal Server Error response
        } else {
            if (rows.length > 0) {
                res.status(200).json(rows[0]); // Send the equipment data as a JSON response
            } else {
                res.status(404).send('Equipment not found'); // Send a 404 response if no equipment is found with the given ID
            }
        }
    });
});

// Route to add a new equipment (AJAX POST)
app.post('/add-equipment-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JavaScript object
    let data = req.body;
    let equipmentTypeID;

    // Capture NULL values for equipmentTypeID
    equipmentTypeID = parseInt(data.equipmentTypeID);
    if (isNaN(equipmentTypeID)) {
        equipmentTypeID = 'NULL';
    }

    // Create the SQL query to insert a new equipment into the Equipments table
    query1 = `INSERT INTO Equipments (barcode, serializationTimestamp, equipmentTypeID) VALUES ('${data.barcode}', '${data.serializationTimestamp}', ${data.equipmentTypeID})`;
    
    // Execute the SQL query to insert the new equipment
    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error during the insertion
        if (error) {
            // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the insertion was successful, perform a SELECT * on Equipments
            query2 = `SELECT * FROM Equipments;`;
            db.pool.query(query2, function(error, rows, fields) {
                // Check if there was an error during the SELECT query
                if (error) {
                    // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    // If all went well, send the results of the SELECt query back to the client.
                    db.pool.query("SELECT LAST_INSERT_ID() as equipmentID", function(error, rows, fields) {
                        if (!error) {
                            // Get the last inserted equipment ID
                            const equipmentID = rows[0].equipmentID;
                            res.send({ equipmentID: equipmentID });
                        } else {
                            // Log the error to the terminal for debugging and send a 500 Internal Server Error response to the client
                            console.log(error);
                            res.sendStatus(500); 
                        }
                    });
                }
            });
        }
    });
});

// Route to delete an equipment and related data (AJAX DELETE)
app.delete('/delete-equipment-ajax/', function(req,res,next){
    let data = req.body;
    let equipmentID = parseInt(data.id);

    // multiple delete queries for cascade operations to avoid data anomalies after deleting an equipment entry
    let deleteEquipments = `DELETE FROM Equipments WHERE equipmentID = ?`;
    let deleteEquipmentProperties= `DELETE FROM EquipmentProperties WHERE equipmentID = ?`;
    let deleteEquipmentTransactions= `DELETE FROM EquipmentTransactions WHERE equipmentID = ?`;
  
  
          // Run the first query to delete related equipment transactions
          db.pool.query(deleteEquipmentTransactions, [equipmentID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query to delete related equipment properties
                  db.pool.query(deleteEquipmentProperties, [equipmentID], function(error, rows, fields) {
  
                      if (error) {
                        // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                        // Run the third query to delete the equipment itself
                        db.pool.query(deleteEquipments, [equipmentID], function(error, rows, fields) {
                            if (error) {
                                // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                // Send a 204 No Content response indicating successful deletion
                                res.sendStatus(204);
                            }
                      })
                    }
                  })
              }
  })});


// Route to update an equipment (AJAX PUT)
app.put('/put-equipment-ajax', function(req, res, next) {
    let data = req.body;

    let equipmentID = parseInt(data.equipmentID); // Assuming 'equipmentID' is the ID of the equipment to be updated
    let barcode = data.barcode;
    let serializationTimestamp = data.serializationTimestamp;
    let equipmentType = parseInt(data.equipmentType); // Assuming 'equipmentType' is the ID of the equipment type

    // Check if barcode is null or empty
    if (!barcode || barcode.trim() === '') {
        // Respond with an error message indicating that barcode cannot be null or empty
        return res.status(400).send('Barcode cannot be null or empty.');
    }

    // SQL query to update the equipment information
    let queryUpdateEquipment = `UPDATE Equipments SET barcode = ?, serializationTimestamp = ?, equipmentTypeID = ? WHERE equipmentID = ?`;

    // SQL query to select the updated equipment data
    let selectEquipment = `SELECT * FROM Equipments WHERE equipmentID = ?`;

    // Run the update query to update equipment information
    db.pool.query(queryUpdateEquipment, [barcode, serializationTimestamp, equipmentType, equipmentID], function(error, rows, fields) {
        if (error) {
            // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the update was successful, run the select query to fetch the updated equipment data
            db.pool.query(selectEquipment, [equipmentID], function(error, rows, fields) {
                if (error) {
                    // Log the error to the terminal for debugging and send a 400 Bad Request response to the client
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    console.log(rows);
                    res.send(rows); // Send the updated equipment data back to the client
                }
            });
        }
    });
});

/*
    SHOP INVENTORY PAGE
*/

// Route to display the Shop Inventory Page
app.get('/shop-inventory.hbs', function(req, res) {
    // SQL query to fetch equipment data along with their types and properties
    let query = `
        SELECT 
            e.equipmentID, 
            e.barcode, 
            et.equipmentTypeName, 
            GROUP_CONCAT(p.propertyName, ': ', ep.value SEPARATOR ', ') AS properties
        FROM Equipments e
        JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
        LEFT JOIN EquipmentProperties ep ON e.equipmentID = ep.equipmentID
        LEFT JOIN Properties p ON ep.propertyID = p.propertyID
        GROUP BY e.equipmentID;
    `;

    // Execute the SQL query to fetch inventory data
    db.pool.query(query, function(error, rows) {
        if (error) {
            // Log an error message if there's an error and send an HTTP 500 status
            console.error('Error fetching inventory data:', error);
            res.sendStatus(500); 
        } else {
            // Prepare data for rendering: Map and transform the retrieved rows into a more structured format
const equipments = rows.map(row => ({
    equipmentID: row.equipmentID,
    barcode: row.barcode,
    equipmentTypeName: row.equipmentTypeName,
    properties: row.properties ? row.properties.split(', ').map(prop => {
        const [name, value] = prop.split(': ');
        return { propertyName: name, value: value };
    }) : [] // Handle the case where row.properties is null
}));


            // Render the shop-inventory page with the equipment data
            res.render('shop-inventory', { equipments: equipments });
        }
    });
});


////////////////////////// MANAGE EQUIPMENT TYPES PAGE ////////////////////////////

// Route to display the Manage Equipment Types Page
app.get('/manage-equipment-types.hbs', function(req, res) {
    // SQL query to select all equipment types
    let query1 = "SELECT * FROM EquipmentTypes;";


    // Execute the SQL query to fetch equipment types
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the equipment types retrieved from the query
        let equipmentTypes = rows;

        // Render the manage-equipment-types page with the equipment type data
        return res.render('manage-equipment-types', {data: equipmentTypes});

    })
});

// Route to fetch equipment type by ID (AJAX GET)
app.get('/get-equipment-type/:equipmentTypeID', function(req, res) {
    const equipmentTypeID = req.params.equipmentTypeID;

    // SQL query to retrieve equipment type data based on the equipmentTypeID
    let query = `SELECT * FROM EquipmentTypes WHERE equipmentTypeID = ?`;

    // Execcute the SQL query to fetch equipment type data
    db.pool.query(query, [equipmentTypeID], function(error, rows, fields) {
        if (error) {
            // Log an error message if there's an error and send a HTTP 500 status
            console.error('Error fetching equipment type:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (rows.length > 0) {
                res.status(200).json(rows[0]); // Send the equipment data as a JSON response
            } else {
                res.status(404).send('Equipment type not found'); // If no equipment type found with the given ID
            }
        }
    });
});

// Route to add a new equipment type (AJAX POST)
app.post('/add-equipment-type-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Set the default value for discontinuedSupportDate if not specified
    let discontinuedSupportDate = data.discontinuedSupportDate ? `'${data.discontinuedSupportDate}'` : 'NULL';
    discontinuedSupportDate = discontinuedSupportDate === "''" ? 'NULL' : discontinuedSupportDate;

    // Create the SQL query to insert a new equipment type into the database
    query1 = `INSERT INTO EquipmentTypes (equipmentTypeName, equipmentTypeDescription, firstSupportDate, discontinuedSupportDate) VALUES ('${data.equipmentTypeName}', '${data.equipmentTypeDescription}', '${data.firstSupportDate}', ${discontinuedSupportDate})`;

    // Execute the SQL query to insert the new equipment type
    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal and send an HTTP response with status 400 (Bad Request)
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * on Equipments
            query2 = `SELECT * FROM EquipmentTypes;`;
            db.pool.query(query2, function(error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal and send an HTTP response with status 400 (Bad Request)
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    // After inserting into Equipments, get the last inserted ID
                    db.pool.query("SELECT LAST_INSERT_ID() as equipmentTypeID", function(error, rows, fields) {
                        if (!error) {
                            const equipmentTypeID = rows[0].equipmentTypeID;
                            res.send({ equipmentTypeID: equipmentTypeID });
                        } else {
                            console.log(error);
                            res.sendStatus(500); // Internal Server Error
                        }
                    });
                }
            });
        }
    });
});

// Route to update an equipment type (AJAX PUT)
app.put('/put-equipment-type-ajax', function(req, res, next) {
    let data = req.body;

    let equipmentTypeID = parseInt(data.equipmentTypeID); // Assuming 'equipmentTypeID' is the ID of the equipment type to be updated
    let equipmentTypeName = data.equipmentTypeName;
    let equipmentTypeDescription = data.equipmentTypeDescription;
    let firstSupportDate = data.firstSupportDate;
    //let discontinuedSupportDate = data.discontinuedSupportDate;
    let discontinuedSupportDate = data.discontinuedSupportDate ? data.discontinuedSupportDate : null;

    // Check if equipment type name is null or empty
    if (!equipmentTypeName || equipmentTypeName.trim() === '') {
        // Respond with an error message indicating that equipmentTypeName cannot be null or empty
        return res.status(400).send('Name of equipment type cannot be null or empty.');
    }

    // Define the SQL query to update the equipment type
    let queryUpdateEquipmentType = `UPDATE EquipmentTypes SET equipmentTypeName = ?, equipmentTypeDescription = ?, firstSupportDate = ?, discontinuedSupportDate = ? WHERE equipmentTypeID = ?`;

    // Define the SQL query to select the updated equipment type
    let selectEquipmentType = `SELECT * FROM EquipmentTypes WHERE equipmentTypeID = ?`;

    // Run the update query to update the equipment type in the database
    db.pool.query(queryUpdateEquipmentType, [equipmentTypeName, equipmentTypeDescription, firstSupportDate, discontinuedSupportDate, equipmentTypeID], function(error, rows, fields) {
        if (error) {
            // Log the error to the terminal and send an HTTP response with status 400 (Bad Request)
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the update was successful, run the select query to fetch the updated equipment data
            db.pool.query(selectEquipmentType, [equipmentTypeID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    console.log(rows);
                    res.send(rows); // Send the updated equipment data back to the client
                }
            });
        }
    });
});

// Route to delete an equipment type and related data (AJAX DELETE)
app.delete('/delete-equipment-type-ajax/', function(req,res,next){
    let data = req.body;
    let equipmentTypeID = parseInt(data.id);

    // Define SQL queries to delete related data when deleting an equipment type
    let deleteEquipmentTypes = `DELETE FROM EquipmentTypes WHERE equipmentTypeID = ?`;
    let deleteEquipmentTypeProperties = `DELETE FROM EquipmentTypeHasDefaultProperties WHERE equipmentTypeID = ?`;
    let deleteEquipments = `DELETE FROM Equipments WHERE equipmentTypeID = ?`;
    let deleteEquipmentProperties = `DELETE FROM EquipmentProperties WHERE equipmentID = (SELECT equipmentID FROM Equipments e JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID WHERE et.equipmentTypeID = ?)`;
    let deleteEquipmentTransactions = `DELETE FROM EquipmentTransactions WHERE equipmentID = (SELECT equipmentID FROM Equipments e JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID WHERE et.equipmentTypeID = ?)`;
  
  
          // Run the queries to delete equipment type and related data
          db.pool.query(deleteEquipmentTransactions, [equipmentTypeID], function(error, rows, fields){
              if (error) {
            
              // Log the error to the terminal and send an HTTP response with status 400 (Bad Request)
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                // If deletion of equipment type was successful, proceed to delete related data

                  // Run the query to delete equipment type properties
                  db.pool.query(deleteEquipmentProperties, [equipmentTypeID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                        // Continue to delete related equipment and their properties and transactions

                        // Run the query to delete equipments associated with the equipment type
                        db.pool.query(deleteEquipments, [equipmentTypeID], function(error, rows, fields) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                // Run the query to delete equipment properties associated with the equipment type
                                db.pool.query(deleteEquipmentTypeProperties, [equipmentTypeID], function(error, rows, fields) {
                                    if (error){
                                        console.log(error);
                                        res.sendStatus(400);
                                    } else {

                                        // Finally, delete equipment transactions associated with the equipment type
                                        db.pool.query(deleteEquipmentTypes, [equipmentTypeID], function(error, rows, fields) {
                                            if (error){
                                                console.log(error);
                                                res.sendStatus(400);
                                            }
                                                else {
                                                    // If all deletions were successful, send an HTTP response with status 204 (No Content)
                                                    res.sendStatus(204);
                                                }
                                            })
                                        
                                    }
                                })
                                
                            }
                      })
                    }
                  })
              }
  })});


////////////////////////////// MANAGE ITEM PROPERTIES PAGE ////////////////////////////////

// Route to display the Manage Item Properties Page
app.get('/manage-properties.hbs', function(req, res) {
    // Declare Query 1 to fetch all properties
    let query1 = "SELECT * FROM Properties;";


    // Execute the 1st query to retrieve properties from the database
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the retrieved properties
        let properties = rows;

        // Render the 'manage-properties' page and provide the properties data to the template
        return res.render('manage-properties', {data: properties});

    })
});

// Route to fetch an item property by its ID
app.get('/get-property/:propertyID', function(req, res) {
    const propertyID = req.params.propertyID;

    // SQL query to retrieve item property data based on the propertyID
    let query = `SELECT * FROM Properties WHERE propertyID = ?`;

    // Execute the query with the provided propertyID parameter
    db.pool.query(query, [propertyID], function(error, rows, fields) {
        if (error) {
            // Log any errors to the console and send a 500 (Internal Server Error) response
            console.error('Error fetching item property:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (rows.length > 0) {
                // Send a 200 (OK) response with the item property data as a JSON response
                res.status(200).json(rows[0]); // Send the property data as a JSON response
            } else {
                // If no item property was found with the given ID, send a 404 (Not Found) response
                res.status(404).send('Item property not found'); 
            }
        }
    });
});

// Route to add a new item property (AJAX POST)
app.post('/add-property-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JavaScript object
    let data = req.body;

    // Create a SQL query to insert a new property with the provided propertyName
    query1 = `INSERT INTO Properties (propertyName) VALUES ('${data.propertyName}')`;

    // Execute the query on the database
    db.pool.query(query1, function(error, rows, fields) {
        // Check if there was an error during the database operation
        if (error) {
            // Log the error to the terminal for debugging purposes
            console.log(error);
            // Send an HTTP response with status 400 (Bad Request) to indicate a failure
            res.sendStatus(400);
        } else {
            // If the operation was successful, respond with an appropriate status code or additional data if necessary
            query2 = `SELECT * FROM Properties;`;
            db.pool.query(query2, function(error, rows, fields) {
                // Check for errors in the second query
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the list of properties as a response
                else {
                    // If all went well, send the list of properties as a response
                    // After inserting into Properties, get the last inserted property's ID
                    db.pool.query("SELECT LAST_INSERT_ID() as propertyID", function(error, rows, fields) {
                        if (!error) {
                            const propertyID = rows[0].propertyID;
                            res.send({ propertyID: propertyID });
                        } else {
                            // Log the error to the terminal and send an HTTP response with status 500 (Internal Server Error)
                            console.log(error);
                            res.sendStatus(500); // Internal Server Error
                        }
                    });
                }
            });
        }
    });
});

// Route to update an existing item property (AJAX PUT)
app.put('/put-property-ajax', function(req, res, next) {
    let data = req.body;

    // Extract propertyID and propertyName from incoming data
    let propertyID = parseInt(data.propertyID); 
    let propertyName = data.propertyName;

    // Check if propertyName is null or empty
    if (!propertyName || propertyName.trim() === '') {
        // Respond with an error message indicating that equipmentTypeName cannot be null or empty
        return res.status(400).send('Name of item property cannot be null or empty.');
    }

    // Define the SQL query to update the property name based on propertyID
    let queryUpdateProperty = `UPDATE Properties SET propertyName = ? WHERE propertyID = ?`;

    // Define the SQL query to select the updated item property data based on propertyID
    let selectProperty = `SELECT * FROM Properties WHERE propertyID = ?`;

    // Execute the update query to change the property name in the database
    db.pool.query(queryUpdateProperty, [propertyName, propertyID], function(error, rows, fields) {
        if (error) {
            // Log the error to the terminal and send an HTTP response with status 400 (Bad Request)
            console.log(error);
            res.sendStatus(400);
        } else {
            // If the update was successful, run the select query to fetch the updated item property data
            db.pool.query(selectProperty, [propertyID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    console.log(rows);
                    res.send(rows); // Send the updated item property data back to the client
                }
            });
        }
    });
});

// Route to delete an item property and related data (AJAX DELETE)
app.delete('/delete-property-ajax/', function(req,res,next){
    let data = req.body;
    let propertyID = parseInt(data.id);

    // Define the SQL query to delete property association from EquipmentTypeHasDefaultProperties
    let deleteProperty = `DELETE FROM Properties WHERE propertyID = ?`;

    // Define the SQL query to delete property association from EquipmentTypeHasDefaultProperties based on propertyID
    let deleteEquipmentTypeProperties = `DELETE FROM EquipmentTypeHasDefaultProperties WHERE propertyID = ?`;

    // Define the SQL query to delete property association from EquipmentProperties based on propertyID
    let deleteEquipmentProperties = `DELETE FROM EquipmentProperties WHERE propertyID = ?`;
  
  
          // Run the first query to delete property associations from EquipmentProperties
          db.pool.query(deleteEquipmentProperties, [propertyID], function(error, rows, fields){
              if (error) {
  
              // Log the errror to the terminal and send an HTTP response with status 400 (Bad Request)
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                // If the first query was successful, proceed to the second query
                  // Run the second query to delete property associations from EquipmentTypeHasDefaultProperties
                  db.pool.query(deleteEquipmentTypeProperties, [propertyID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                        // If the second query was successful, proceed to the third query
                        // Run the third query to delete the property itself from Properties
                        db.pool.query(deleteProperty, [propertyID], function(error, rows, fields) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                // Send an HTTP response with status 204 (No Content) to indicate successful deletion
                                res.sendStatus(204);                                
                            }
                      })
                    }
                  })
              }
  })});

////////////////////////////// MANAGE EQUIPMENT PROPERTIES PAGE ////////////////////////////////

// Route to display the Manage Equipment Details Page
app.get('/manage-equipment-properties.hbs', function(req, res) {
    // Define the SQL query to retrieve equipment properties for a specific equipment
    let query = "SELECT p.propertyName, ep.value FROM Equipments e INNER JOIN EquipmentProperties ep ON e.equipmentID = ep.equipmentID INNER JOIN Properties p ON ep.propertyID = p.propertyID WHERE e.barcode = 'SCN12345';";

    // Execute the SQL query to fetch equipment properties
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('SQL error', error);
            res.sendStatus(500); // Send an HTTP 500 status in case of an internal server error
        } else {
            // Render the 'manage-statuses' page with the fetched equipment properties
            res.render('manage-equipment-properties', { statuses: rows });
        }
    });
});

// Route to fetch properties based on the selected equipment type
  app.get('/get-properties', function(req, res) {
    // Extract the selected equipment type ID from the request query parameters
    const selectedEquipmentTypeID = req.query.equipmentTypeID;

    // Define the SQL query to retrieve properties associatied with the selected equipment type
    let query3 = `SELECT p.propertyName as 'Property', p.propertyID as 'propertyID' FROM Properties p JOIN EquipmentTypeHasDefaultProperties edp ON p.propertyID = edp.propertyID WHERE equipmentTypeID = ${selectedEquipmentTypeID};`

    // Execute the SQL query to fetch properties
    db.pool.query(query3, function(error, rows, fields) {
        if (error) {
            console.error('Error fetching properties:', error);
            res.status(500).send('Internal Server Error'); // Send an HTTP 500 status in case of an internal server error
        } else {
            // Send the properties as JSON response
            console.log(rows)
            res.json(rows);
        }
    });
});  

// Route to add equipment properties (AJAX POST)
app.post('/add-equipment-properties-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JavaScript object
    let data = req.body;

    // Extract equipmentID and typeSpecificProperties from the received data
    let equipmentID = data.equipmentID;
    let typeSpecificProperties = data.typeSpecificProperties;

    // Iterate over typeSpecificProperties and insert into EquipmentProperties table
    for (let propertyID in typeSpecificProperties) {
        let value = typeSpecificProperties[propertyID];

        // Create the SQL query to insert property values into the EquipmentProperties table
        let query = `INSERT INTO EquipmentProperties (equipmentID, propertyID, value) VALUES (${equipmentID}, ${propertyID}, '${value}')`;

        // Execute the query on the database
        db.pool.query(query, function(error, rows, fields) {
            // Check for errors during the database operation and send the appropriate response
            if (error) {
                console.log(error); 
                res.sendStatus(400); // Send an HTTP response with status 400 (Bad Request) in case of an error
                return;
            }
        });
    }

    // Send a success response with status 200 (OK) once all insertions are complete
    res.sendStatus(200);
});

// Route to fetch equipment property values (AJAX GET)
app.get('/get-equipment-property-values', function(req, res) {
    // Extract equipmentID and propertyID from the request query parameters
    const equipmentID = req.query.equipmentID;
    const propertyID = req.query.propertyID;

    // Create a SQL query to retrieve property values for the given equipmentID and propertyID
    const query = `SELECT propertyID, value FROM EquipmentProperties WHERE equipmentID = ${equipmentID} AND propertyID = ${propertyID};`;

    // Execute the query on the database
    db.pool.query(query, [equipmentID], function(error, rows, fields) {
        if (error) {
            console.error('Error fetching equipment property values:', error);
            res.status(500).send('Internal Server Error'); // Send a 500 (Internal Server Error) response in case of an error
        } else {
            console.log(rows)
            res.json(rows); // Send property values as a JSON response
        }
    });
});

// Route to update and equipment property value (AJAX PUT)
app.put('/update-property-value', function(req, res) {
    // Extract the necessary data from the request body
    const equipmentID = req.query.equipmentID;
    const propertyID = req.query.propertyID;
    const value = req.query.value;

    // Log the receieved value for debugging purposes
    console.log(value);

    // Check if equipmentID, propertyID, and value are provided
    if (!equipmentID || !propertyID || value === undefined) {
        return res.status(400).send('Invalid input. Please provide equipmentID, propertyID, and value.');
    }

    // Check if there is already a values for the property in the EquipmentProperties table, otherwise add an empty value
    const query1 = `SELECT * FROM EquipmentProperties WHERE equipmentID = ${equipmentID} AND propertyID = ${propertyID};`;
    
    db.pool.query(query1, [equipmentID, propertyID], function(error, results) {
        if (error) {
            console.error('Error fetching property:', error);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            console.log('Property was deleted or never added, adding new entry');
            const query2 = `INSERT INTO EquipmentProperties (equipmentID, propertyID, value) VALUES (${equipmentID}, ${propertyID}, '${value}')`;
            db.pool.query(query2, [equipmentID, propertyID, value], function(error) {
                // Check for errors and send the appropriate response
                if (error) {
                    console.log(error);
                    return res.status(400).send('Failed to add new entry');
                }
                console.log('New entry added successfully');
                return res.status(200).send('Property value added successfully');
            });
        } else {
            // Update the value in the EquipmentProperties table
            const query3 = `UPDATE EquipmentProperties SET value = '${value}' WHERE equipmentID = ${equipmentID} AND propertyID = ${propertyID}`;
            
            db.pool.query(query3, [value, equipmentID, propertyID], function(error, results, fields) {
                if (error) {
                    console.error('Error updating property value:', error);
                    return res.status(500).send('Internal Server Error');
                }

                // Check if the property value was updated successfully
                if (results.affectedRows === 0) {
                    return res.status(404).send('Property value not updated. Equipment ID or Property ID not found.');
                }

                // Send a success response
                return res.status(200).send('Property value updated successfully');
            });
        }
    });
});


/*
    TYPE-SPECIFIC PROPERTIES MANAGEMENT PAGE
*/

// Route to display the Mange Equipment Type Properties Page (AJAX GET)
app.get('/manage-equipment-type-properties.hbs', function(req, res) {
    // Query to fetch all equipment types
    let query1 = "SELECT * FROM EquipmentTypes";
        
        // Execute the first query to retrieve equipment types
        db.pool.query(query1, (error, rows, fields) => {
            
            // Save the retrieved equipment types
            let equipmentTypes = rows;
            
            // Render the 'manage-equipment-type-properties' page and provide the equipment types data to the template
            return res.render('manage-equipment-type-properties', {equipmentTypesData: equipmentTypes});
            
        })

});

// Route to get the properties not yet linked to a specific equipment type as available options to add to that equipment type
app.get('/get-available-properties', function(req, res){
    let equipmentTypeID = req.query.equipmentTypeID; // Extract the equipmentTypeID parameter from the GET request

    // SQL query to select properties that are not yet associated with the specified equipment type
    let query = `
        SELECT P.propertyID, P.propertyName
        FROM Properties P
        LEFT JOIN EquipmentTypeHasDefaultProperties E ON P.propertyID = E.propertyID AND E.equipmentTypeID = ${equipmentTypeID}
        WHERE E.propertyID IS NULL
    `;

    // Execute the SQL query using the database connection
    db.pool.query(query, function(err, results) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching available properties');
        } else {
            // Send the results back as JSON
            console.log(results);
            res.json(results);
        }
    });
});

// Route to add a type-specific property to an equipment type (AJAX POST)
app.post('/add-type-specific-property-ajax', function(req, res){
    let equipmentTypeID = req.body.equipmentTypeID;
    let propertyID = req.body.propertyID;

    // SQL query to insert a new type-specific property association
    let query = `INSERT INTO EquipmentTypeHasDefaultProperties (equipmentTypeID, propertyID)
        VALUES (${equipmentTypeID}, ${propertyID});
    `;

    // Execute query using the database connection
    db.pool.query(query, function(error, results){
        if (error) {
            console.error('Error adding type-specific property', error);
            res.sendStatus(500); // Send a 500 status code for internal server error
        } else {
             // Responsd with a 201 status code indicating successful creation, and provide a JSON response with a message
    res.status(201).json({ message: `Type-specific property added with ID: ${results.insertId}` });
        }
    });
});

// Route to update a type-specific property association (AJAX PUT)
app.put('/update-type-specific-property-ajax/:id', function(req, res) {
    // Extract necessary data from the request body
    let equipmentTypeID = req.body.equipmentTypeID;
    let propertyID = req.body.propertyID;
    let oldPropertyID = req.body.oldPropertyID;

    // SQL query to update the type-specific property association
    let query = "UPDATE EquipmentTypeHasDefaultProperties SET propertyID = ? WHERE equipmentTypeID = ? and propertyID = ?";
    
    // Execute the query using the database connection
    db.pool.query(query, [propertyID, equipmentTypeID, oldPropertyID], function(error, result) {
        if (error) {
            console.error('Error updating type-specific property', error);
            res.sendStatus(500); // Send a 500 status code for internal server error
        } else {
            res.sendStatus(200); // Send a 200 status code indicating success
        }
    });
});

// Route to delete a type-specific property association (AJAX DELETE)
app.delete('/delete-type-specific-property-ajax/:id', function(req, res) {
    // Extract necessary data from the request body
    let equipmentTypeID = req.body.equipmentTypeID;
    let propertyID = req.body.propertyID;

    // SQL queries to delete the type-specific property association and related equipment properties
    let query1 = `DELETE FROM EquipmentTypeHasDefaultProperties WHERE equipmentTypeID = ? and propertyID = ?;`;
    let query2 = `DELETE FROM EquipmentProperties
                    WHERE equipmentID IN (
                        SELECT equipmentID
                        FROM Equipments
                        WHERE equipmentTypeID = ?
                    ) 
                    AND propertyID = ?;
                `;


    // Execute query1 to delete the type-specific property association
    db.pool.query(query1, [equipmentTypeID, propertyID], function(error, result1) {
        if (error) {
            console.error('Error deleting type-specific property', error);
            res.sendStatus(500); // Send a 500 status code for internal server error
        } else {
            // If query1 is successful, execute query2 to delete related equipment properties
            db.pool.query(query2, [equipmentTypeID, propertyID], function(err, result2) {
                if (err) {
                    console.error('Error deleting type-specific property', err);
                    res.sendStatus(500); // Send a 500 status code for internal server error
                } else {
                    res.sendStatus(200); // Send a 200 status code indicating success
                }
            });
        }
    });
});


/*
    STATUS MANAGEMENT PAGE
*/

// Route to display the Manage Statuses Page
app.get('/manage-statuses.hbs', function(req, res) {
    // Define the SQL query to select all statuses
    let query = "SELECT * FROM Statuses;";

    // Execute the query to retrieve all statuses from the database
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('SQL error', error);
            res.sendStatus(500); // Internal Server Error
        } else {
            // Render the 'manage-statuses' page with the retrieved status data
            res.render('manage-statuses', { statuses: rows });
        }
    });
});

// Route to fetch all statuses (AJAX GET)
app.get('/get-statuses-ajax', function(req, res) {
    // SQL query to fetch all statuses from the database
    let query = "SELECT * FROM Statuses;";

    // Execute the SQL query to retrieve all statuses
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('Error fetching statuses:', error);
            res.status(500).json({ message: 'Internal Server Error' }); // Send JSON response with error message
        } else {
            res.json(rows); // Send the retrieved statuses as JSON response
        }
    });
});

// Route to fetch an individual status for update (AJAX GET)
app.get('/get-status/:id', function(req, res) {
    // Extract the status ID from the request parameters
    let statusID = req.params.id;

    // SQL query to retreieve the status with the given statusID
    let query = "SELECT * FROM Statuses WHERE statusID = ?";

    // Execute the SQL query with the provided statusID
    db.pool.query(query, [statusID], function(error, rows, fields) {
        if (error) {
            // Handle database query error
            console.error('Error fetching status', error);
            res.status(500).send('Internal Server Error'); // Respond with a 500 status code for internal server error
        } else {
            if (rows.length > 0) {
                // If a status with the given ID was found, send the status data as a JSON response
                res.json(rows[0]);
            } else {
                // If no status is found with the given ID, send a 404 status code
                res.status(404).send('Status not found');
            }
        }
    });
});


// Route to add a new status (AJAX POST)
app.post('/add-status-ajax', function(req, res) {
    // Extract relevant data from the request body
    let { statusName, statusDescription, statusDate } = req.body;

    // SQL query to insert a new status into the database
    let query = "INSERT INTO Statuses (statusName, statusDescription, statusDate) VALUES (?, ?, ?)";
    
    // Execute the SQL query to insert the new status
    db.pool.query(query, [statusName, statusDescription, statusDate], function(error, result) {
        if (error) {
            // Handle database query error
            console.error('Error adding status', error);
            res.sendStatus(500); // Respond with a 500 status code for internal server error
        } else {
             // If the status is successfully added, respond with a 201 status code indicating successful creation, and provide a JSON response with a message
    res.status(201).json({ message: `Status added with ID: ${result.insertId}` });
        }
    });
});

// Route to update a status (AJAX PUT)
app.put('/update-status-ajax/:id', function(req, res) {
    // Extract the status ID from the URL parameter
    let statusID = req.params.id;

    // Extract updated status data from the request body
    let { statusName, statusDescription, statusDate } = req.body;

    // SQL query to update the status with the given statusID
    let query = "UPDATE Statuses SET statusName = ?, statusDescription = ?, statusDate = ? WHERE statusID = ?";
    
    // Execute the SQL query with the extracted data
    db.pool.query(query, [statusName, statusDescription, statusDate, statusID], function(error, result) {
        if (error) {
            // Handle database query error
            console.error('Error updating status', error);
            res.sendStatus(500); // Respond with a 500 status code for internal server error
        } else {
            res.sendStatus(200); // If the status is successfully updated, respond with a 200 status code indicating success
        }
    });
});

// Route to delete a status (AJAX DELETE)
app.delete('/delete-status-ajax/:id', function(req, res) {
    // Extract the status ID from the URL parameter
    let statusID = req.params.id;

    // SQL query to delete the status with the provided statusID
    let query = "DELETE FROM Statuses WHERE statusID = ?";
    
    // Execute the SQL query with the extracted statusID
    db.pool.query(query, [statusID], function(error, result) {
        if (error) {
            // Handle database query error
            console.error('Error deleting status', error);
            res.sendStatus(500); // Respond with a 500 status code for internal server error
        } else {
            // If the status is successfully deleted, respond with a 200 status code indicating success
            res.sendStatus(200);
        }
    });
});



/*
    WORKFLOW MANAGEMENT PAGE
*/

// Route to display the Transition Statuses Page (AJAX GET)
app.get('/manage-transition-statuses.hbs', function(req, res) {
    // SQL query to fetch transition statuses with pre and post status names
    let query = `
    SELECT 
    vst.validStatusTransitionID, 
    vst.validStatusTransitionName, 
    vst.validStatusTransitionDescription, 
    s1.statusName AS preStatusName, 
    s2.statusName AS postStatusName 
FROM 
    ValidStatusTransitions vst 
LEFT JOIN 
    Statuses s1 ON vst.preStatusID = s1.statusID 
LEFT JOIN 
    Statuses s2 ON vst.postStatusID = s2.statusID;

    `;

    // Execute the SQL query to fetch transition statuses
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            // Handle SQL error
            console.error('SQL error', error);
            res.sendStatus(500); // Respond with a 500 status code for internal server error
        } else {
            // Log the fetched data and render the page with the data
            console.log(rows); 
            res.render('manage-transition-statuses', {validStatusTransitions: rows});
        }
    });
});


// Route to fetch all status options (AJAX GET)
app.get('/get-statuses-ajax', function(req, res) {
    console.log("Fetching all statuses...");

    // SQL query to retrieve status IDs and names
    let query = "SELECT statusID, statusName FROM Statuses;";

    // Execute the SQL query to fetch statuses
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            // Handle SQL error
            console.error('Error fetching statuses:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            // Log successful fetch and send statuses as JSON response
            console.log("Statuses fetched successfully:", rows);
            res.json(rows); // Send all statuses as JSON
        }
    });
});



// Route to fetch a specific status transition for Update (AJAX GET)
app.get('/get-status-transitions/:id', function(req, res) {
    // Extract the transition ID from the request parameters
    let transitionID = req.params.id;

    // SQL query to retrieve details of a specific status transition
    let query = `
        SELECT vst.*, s1.statusName as preStatusName, s2.statusName as postStatusName 
        FROM ValidStatusTransitions vst
        JOIN Statuses s1 ON vst.preStatusID = s1.statusID
        JOIN Statuses s2 ON vst.postStatusID = s2.statusID
        WHERE vst.validStatusTransitionID = ?;
    `;

    // Execute the SQL query with the provided transitionID as a parameter
    db.pool.query(query, [transitionID], function(error, rows, fields) {
        if (error) {
            // Handle SQL error and send an internal server error response
            console.error('Error fetching status transition:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (rows.length > 0) {
                // Send the retrieved status transition details as a JSON response
                res.json(rows[0]);
            } else {
                // Send a 404 status code and message if the status transition is not found
                res.status(404).send('Status transition not found');
            }
        }
    });
});

// Route to add a new transition status (AJAX POST)
app.post('/add-transition-status-ajax', function(req, res) {
    // Extract relevant data from the request body
    let { validStatusTransitionName, validStatusTransitionDescription, preStatusID, postStatusID } = req.body;

    // SQL query to insert a new transition status into the database
    let query = "INSERT INTO ValidStatusTransitions (validStatusTransitionName, validStatusTransitionDescription, preStatusID, postStatusID) VALUES (?, ?, ?, ?)";
    
    // Execute the SQL query with the provided data as parameters
    db.pool.query(query, [validStatusTransitionName, validStatusTransitionDescription, preStatusID, postStatusID], function(error, result) {
        if (error) {
            // Handle SQL error and send an internal server error response
            console.error('Error in inserting transition status:', error);
            res.sendStatus(500);
        } else {
            // Send a 201 status code with a success message, including the ID of the newly inserted transition status
            res.status(201).send(`Transition status added with ID: ${result.insertId}`);
        }
    });
});


// Route to update a transition status (AJAX PUT)
app.put('/update-transition-status-ajax/:id', function(req, res) {
    // Extract the transition ID from the URL parameter
    let transitionID = req.params.id;

    // Extract data from the request body
    let { validStatusTransitionName, validStatusTransitionDescription, preStatusID, postStatusID } = req.body;

    // Log the received parameters and body data for debugging
    console.log("Updating Transition Status ID:", transitionID);
    console.log("Received Data:", req.body);

    // SQL query to update the transition status based on its ID
    let query = "UPDATE ValidStatusTransitions SET validStatusTransitionName = ?, validStatusTransitionDescription = ?, preStatusID = ?, postStatusID = ? WHERE validStatusTransitionID = ?";

    // Execute the SQL query with the provided data as parameters
    db.pool.query(query, [validStatusTransitionName, validStatusTransitionDescription, preStatusID, postStatusID, transitionID], function(error, result) {
        if (error) {
            // Log detailed error message for debugging
            console.error('Error in updating transition status:', error);

            // Send a more detailed error message to the client for debugging
            res.status(500).send('Error in updating transition status: ' + error.message);
        } else {
            // Optionally log the result for debugging
            console.log("Update Result:", result);

            // Check if any rows were actually updated
            if (result.affectedRows > 0) {
                res.status(200).send('Status transition updated successfully'); // OK, row(s) updated with success message
            } else {
                // No rows updated, could be because the ID doesn't exist
                res.status(404).send(`No transition status found with ID: ${transitionID}`);
            }
        }
    });
});



// Route to delete an existing transition status (AJAX DELETE)
app.delete('/delete-transition-status-ajax/:id', function(req, res) {
    let transitionID = req.params.id;

    let query = "DELETE FROM ValidStatusTransitions WHERE validStatusTransitionID = ?";
    
    db.pool.query(query, [transitionID], function(error, result) {
        if (error) {
            console.error('Error in deleting transition status:', error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});


/*
    OTHER USEFUL METHODS
*/

// ** REQUIRED BY EquipmentProperties PAGE ** 
// Route to find the corresponding equipmentID of an equipment when searched using its barcode (AJAX POST)
app.post('/search-by-barcode-ajax', function(req, res) {
    // Extract the barcode entered for an equipment from the request
    let data = req.body
    let inputBarcode
    inputBarcode = data.barcode

    // Construct a SQL query to fetch corresponding equipmentID, equipmentTypeName, and equipmentTypeID
    let query = `SELECT equipmentID, equipmentTypeName, et.equipmentTypeID FROM EquipmentTypes et, (SELECT equipmentID, equipmentTypeID FROM Equipments WHERE barcode = '${inputBarcode}') e WHERE et.equipmentTypeID = e.equipmentTypeID;`


    // Execute the SQL query with the provided barcode as a parameter
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error('Error fetching properties:', error);
            res.status(500).send('Internal Server Error');
        } else {
            // Send the equipment information as JSON response
            console.log(rows)
            res.send(rows);
        }
    });
}
);

    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
