const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database
const db = new sqlite3.Database(':memory:'); // Using memory for now, can switch to file later

db.serialize(() => {
  db.run("CREATE TABLE questions (id INTEGER, subject TEXT, topic TEXT, difficulty INTEGER, stem TEXT, answer TEXT)");
  db.run("CREATE TABLE user_history (user_id INTEGER, question_id INTEGER)");
});

// The "No-Repeat" Engine
app.get('/api/generate-paper', (req, res) => {
  const userId = 1; // Default for Abhay
  const query = `
    SELECT * FROM questions 
    WHERE id NOT IN (SELECT question_id FROM user_history WHERE user_id = ?)
    ORDER BY RANDOM() LIMIT 75`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`AstraJEE Server running on port ${port}`);
});
