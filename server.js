// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend from /public

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('DB Connection Error:', err);
    return;
  }
  console.log('Connected to database');
});

// Routes

// Get all stories
app.get('/stories', (req, res) => {
  db.query('SELECT * FROM stories ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Submit a new story
app.post('/stories', (req, res) => {
  const { content, author } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  db.query(
    'INSERT INTO stories (content, author) VALUES (?, ?)',
    [content, author || 'Anonymous'],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Story submitted successfully!' });
    }
  );
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

