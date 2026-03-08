import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sarang@297",
  database: "codecampus",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});


// SIGNUP
app.post("/api/signup", (req, res) => {
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
app.post("/api/login", (req, res) => {
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


app.listen(5001, () => {
  console.log("Server running on port 5001");
});