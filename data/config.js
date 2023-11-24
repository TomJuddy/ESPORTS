const mysql = require("mysql");

// Set MySQL database connection parameters
const config = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "esports"
};

// Create a mySql connection pool
const pool = mysql.createPool(config);

// Export the pool for use elsewhere
module.exports = pool;