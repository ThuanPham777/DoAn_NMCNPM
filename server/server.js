const app = require('./app');
const PORT = process.env.PORT || 3001;

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
