const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // phpMyAdmin username
  password: "140193",       // phpMyAdmin password
  database: "donornet"
});

db.connect(err => {
  if (err) console.error("DB Error:", err);
  else console.log("MySQL Connected");
});

// Register Donor
app.post("/register", (req, res) => {
  const { name, blood_group, city, phone } = req.body;

  const sql = "INSERT INTO donors (name, blood_group, city, phone) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, blood_group, city, phone], (err) => {
    if (err) return res.json({ message: "Error registering donor" });
    return res.json({ message: "Donor registered successfully!" });
  });
});

// Search Donor
app.get("/search/:bg", (req, res) => {
  const bg = req.params.bg;

  db.query("SELECT * FROM donors WHERE blood_group = ?", [bg], (err, results) => {
    if (err) return res.json([]);
    return res.json(results);
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
