const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS questions (id INTEGER, subject TEXT, topic TEXT, difficulty INTEGER, stem TEXT, answer TEXT)");
  
  const stmt = db.prepare("INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?)");

  // High-Weightage Physics: Mechanics & Electrodynamics
  const physicsData = [
    { id: 1, topic: "Mechanics", diff: 10, stem: "A cylinder of mass M and radius R is pulled by a horizontal force F at its center. Find acceleration if it rolls without slipping.", ans: "F / (1.5M)" },
    { id: 2, topic: "Electrodynamics", diff: 10, stem: "Calculate the equivalent capacitance between points A and B in an infinite ladder of capacitors C1 and C2.", ans: "C1/2 + √(C1²/4 + C1C2)" },
    // Imagine 248 more high-rigor entries here...
  ];

  physicsData.forEach(q => {
    stmt.run(q.id, "Physics", q.topic, q.diff, q.stem, q.ans);
  });

  stmt.finalize();
  console.log("Database seeded based on JEE Weightage!");
});
