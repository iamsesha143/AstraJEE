const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite'); // This creates a permanent file

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS questions (id INTEGER, subject TEXT, topic TEXT, difficulty INTEGER, stem TEXT, answer TEXT)");
  
  const stmt = db.prepare("INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?)");
  
  // Sample 10/10 Rigor Questions
  stmt.run(1, "Physics", "Mechanics", 10, "A solid sphere of mass M and radius R rolls without slipping down an incline of angle θ. Find the linear acceleration.", "5/7 g sin θ");
  stmt.run(2, "Math", "Calculus", 10, "Evaluate the integral of e^(x^2) from 0 to infinity.", "√π / 2");
  stmt.run(3, "Chemistry", "Organic", 10, "Identify the major product of the Reimer-Tiemann reaction with phenol.", "Salicylaldehyde");

  stmt.finalize();
  console.log("Database seeded with JEE Rigor!");
});
