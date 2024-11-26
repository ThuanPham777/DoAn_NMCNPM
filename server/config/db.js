// db.js
require('dotenv').config(); // Load environment variables from .env file
const sql = require('mssql');

// Database configuration object
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
    trustedConnection: true,
    instancename: 'SQLEXPRESS',
  },
  port: 1433,
};

// Function to establish a connection pool
const connectToDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connected to the database successfully');
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

module.exports = connectToDB;
