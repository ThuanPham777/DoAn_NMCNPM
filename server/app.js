const express = require('express');
const connectToDB = require('./config/db'); // Import database connection
const authRoutes = require('./app/user/routes/auth');
const tournamentRoutes = require('./app/tournament/routes/tournament');
const teamRoutes = require('./app/teams/routes/team');
const playerRoutes = require('./app/players/routes/player');
const ruleRoutes = require('./app/rule/routes/rule');
const roundRoutes = require('./app/rounds/routes/round');
const matchRoutes = require('./app/matches/routes/match');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173', // Set the frontend URL
    credentials: true, // Cho phép gửi cookie
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.use('/api/auth/', authRoutes);
app.use('/api/tournament/', tournamentRoutes);
app.use('/api/team/', teamRoutes);
app.use('/api/player/', playerRoutes);
app.use('/api/rule/', ruleRoutes);
app.use('/api/round/', roundRoutes);
app.use('/api/match/', matchRoutes);

module.exports = app;
