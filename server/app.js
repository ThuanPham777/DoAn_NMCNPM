const express = require('express');
const connectToDB = require('./config/db'); // Import database connection
const authRoutes = require('./app/user/routes/auth.route');
const tournamentRoutes = require('./app/tournament/routes/tournament.route');
const teamRoutes = require('./app/teams/routes/team.route');
const playerRoutes = require('./app/players/routes/player.route');
const ruleRoutes = require('./app/rule/routes/rule.route');
const scheduleRoutes = require('./app/schedules/routes/schedule.route');
const matchRoutes = require('./app/matches/routes/match.route');
const roundRoutes = require('./app/rounds/routes/round.route');
const reportRoutes = require('./app/report/routes/report.route');
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
app.use('/api/tournament', tournamentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/rule', ruleRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/round', roundRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;
