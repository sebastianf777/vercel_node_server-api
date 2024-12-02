// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb'); // Import MongoDB client
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()); // To parse JSON in request bodies

// MongoDB setup
let db;
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('vercel_node_server'); // Replace 'myFirstDatabase' with the name of your database
    console.log('Connected to Database');
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

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

  const collection = db.collection('ipData');
  collection.insertOne({ prefix, ip, timestamp })
    .then(result => {
      console.log('IP data stored successfully:', result);
      res.status(200).json({ message: 'IP data stored successfully' });
    })
    .catch(error => {
      console.error('Error storing IP data:', error);
      res.status(500).json({ message: 'Error storing IP data' });
    });
});

// Start the server (for local testing)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // For Vercel
