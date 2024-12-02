// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse JSON in request bodies

// Middleware to check the API key
app.use((req, res, next) => {
  const apiKey = req.headers['x_api_key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
});

// API endpoint to store IP data
app.post('/api/store-ip', (req, res) => {
  const { prefix, ip, timestamp } = req.body;

  if (!prefix || !ip || !timestamp) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // Simulating storing the data (in reality, you'd connect to a database)
  console.log(`Storing IP data: Prefix: ${prefix}, IP: ${ip}, Timestamp: ${timestamp}`);
  res.status(200).json({ message: 'IP data stored successfully' });
});

// Start the server (for local testing)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // For Vercel
