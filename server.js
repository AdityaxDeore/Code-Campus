import express from "express"
import cors from "cors"
import db from "./database.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Server running")
})


// signup
app.post("/api/signup", (req, res) => {

  const { name, email, password } = req.body

  const sql =
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)"

  db.query(sql, [name, email, password, "student"], (err, result) => {

    if (err) {
      console.error(err)
      return res.status(500).json(err)
    }

    res.json({ message: "User registered successfully" })

  })

})


app.get("/api/users", (req, res) => {

  db.query("SELECT * FROM users", (err, result) => {

    if (err) {
      return res.status(500).json(err)
    }

    res.json(result)

  })

})


app.listen(5001, () => {
  console.log("Server running on port 5001")
})