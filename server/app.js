const express = require('express');
const connectToDB = require('./config/db'); // Import database connection
const authRoutes = require('./app/user/routes/auth');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

// Middleware to parse JSON requests
app.use(express.json());

(async () => {
  let pool;
  try {
    // Establish a connection to the SQL Server database
    pool = await connectToDB();
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the application if connection fails
  } finally {
    if (pool) await pool.close();
  }
})();

// routes
// user api

app.use('/api/auth', authRoutes);

module.exports = app;
