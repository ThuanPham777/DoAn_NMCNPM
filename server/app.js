const express = require('express');
const app = express();

// Middleware ví dụ
app.use(express.json());

// Định nghĩa route
app.get('/', (req, res) => {
  res.send('Hello, from the app!');
});

module.exports = app;
