const express = require('express');
const app = express();
const port = 3000; // You can choose any available port

// Middleware (optional, but often used)
app.use(express.json()); // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Define routes
app.get('/', (req, res) => {
  res.send('Hello from Express.js!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});