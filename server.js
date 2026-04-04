import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "codecampus",
  port: Number(process.env.DB_PORT || 3306),
});

let isDbConnected = false;

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    isDbConnected = true;
    console.log("MySQL connected successfully");
  }
});

const ensureDbConnected = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      message: "Database unavailable. Verify MySQL is running and DB_* credentials in .env are correct.",
    });
  }
  next();
};


// SIGNUP
app.post("/api/signup", ensureDbConnected, (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO users (name,email,password) VALUES (?,?,?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "User already exists or database error",
      });
    }

    res.json({
      message: "User registered successfully",
    });
  });
});


// LOGIN
app.post("/api/login", ensureDbConnected, (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: result[0],
    });
  });
});


const port = Number(process.env.SERVER_PORT || 5001);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});