// ./database/db-connector.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'db-connector.js', is adapted from the CS 340 starter app code used as part of the Golden Beach Electronics Inventory Management System.

    Adaptations (as of 11/14/23):
    - The code structure for setting up a MySQL connection pool using the 'mysql' module is retained from the CS 340 starter app code.
    - The provided database credentials for 'host', 'user', 'password', and 'database' are specific to the Golden Beach Electronics Inventory Management System.

    Original Elements:
    - The core functionality of creating a connection pool for MySQL database access is retained from the CS 340 starter app code.

    Citation Scope: Entire 'db-connector.js' file
    Originality: Adapted from CS 340 starter app code for database connection setup.
    Source: CS 340 starter app code

    ---------------------------------
    END OF CITATIONS
*/
// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    //user            : '',
    //password        : '',
    database        : 'cs340_tsaits'
})

// Export it for use in our applicaiton
module.exports.pool = pool;
