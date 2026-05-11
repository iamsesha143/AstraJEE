const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database
const db = new sqlite3.Database('./database.sqlite'); // Using memory for now, can switch to file later

db.serialize(() => {
  // 1. Create the tables if they don't exist
  db.run("CREATE TABLE IF NOT EXISTS questions (id INTEGER, subject TEXT, topic TEXT, difficulty INTEGER, stem TEXT, answer TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS user_history (user_id INTEGER, question_id INTEGER)");

  // 2. Check if the database is empty
  db.get("SELECT count(*) as count FROM questions", (err, row) => {
    if (row.count === 0) {
      console.log("Seeding initial questions...");
      const stmt = db.prepare("INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?)");
      
      // Our 10/10 Rigor Questions
      stmt.run(1, "Physics", "Mechanics", 10, "A solid sphere of mass M and radius R rolls without slipping down an incline of angle θ. Find the linear acceleration.", "5/7 g sin θ");
      stmt.run(2, "Math", "Calculus", 10, "Evaluate the integral of e^(x^2) from 0 to infinity.", "√π / 2");
      stmt.run(3, "Chemistry", "Organic", 10, "Identify the major product of the Reimer-Tiemann reaction with phenol.", "Salicylaldehyde");

      stmt.finalize();
    } else {
      console.log("Database already has questions.");
    }
  });
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
