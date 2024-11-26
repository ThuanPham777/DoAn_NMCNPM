const express = require('express');
const connectToDB = require('./config/db'); // Import database connection
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', async (req, res) => {
  let pool; // Declare connection pool variable
  try {
    // Establish a connection to the SQL Server database
    pool = await connectToDB();

    // Create a new request object
    const request = pool.request();

    // Execute a simple SQL query
    const result = await request.query('SELECT * FROM Player');

    // Respond with the result as JSON
    res.json(result.recordset);
  } catch (err) {
    // Log the error (avoid exposing sensitive details)
    console.error('Database error:', err);

    // Respond with a generic message
    res.status(500).send('An error occurred while retrieving data');
  } finally {
    // Ensure the connection pool is closed
    if (pool) await pool.close();
  }
});

module.exports = app;
