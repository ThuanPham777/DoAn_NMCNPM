const express = require('express');
const connectToDB = require('./config/db'); // Import database connection
const authRoutes = require('./app/user/routes/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173', // Set the frontend URL
    credentials: true, // Cho phép gửi cookie
  })
);

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
