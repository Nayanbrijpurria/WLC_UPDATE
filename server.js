require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Allow requests from your frontend (Live Server, etc.)
app.use(cors()); 
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Simple health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// Save user info
app.post("/api/users", async (req, res) => {
  try {
    const { username, userContact, cowName, cowAge, cowBreed } = req.body;

    // Basic validation
    if (!username || !userContact || !cowName || !cowAge || !cowBreed) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const ageNum = parseInt(cowAge, 10);
    if (Number.isNaN(ageNum) || ageNum < 0) {
      return res.status(400).json({ error: "cowAge must be a valid number." });
    }

    const sql =
      "INSERT INTO users (username, userContact, cowName, cowAge, cowBreed) VALUES (?, ?, ?, ?, ?)";
    const params = [username, userContact, cowName, ageNum, cowBreed];

    const [result] = await pool.execute(sql, params);

    res.status(201).json({
      message: "User info saved successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// (Optional) fetch all users to verify inserts
app.get("/api/users", async (_req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
