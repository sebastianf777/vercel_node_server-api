// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb'); // Import MongoDB client
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To parse JSON in request bodies

// MongoDB setup
let db;
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    db = client.db('vercel_node_server'); // Replace with the correct database name
    console.log('Connected to Database');

    // Middleware to check the API key
    app.use((req, res, next) => {
      const apiKey = req.headers['x-api-key']; // Fixed the header key to use hyphen
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

      const collection = db.collection('vercel_node_server'); // Correct collection name
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

    // Start the server only after the database connection is ready
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// No `app.listen()` outside the `.then()` block, to ensure server only starts after DB is ready
