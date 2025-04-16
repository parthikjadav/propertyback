require("dotenv").config()

const cookieParser = require("cookie-parser")
const express = require("express")
const connectDB = require("./db")
const routes = require("./routes")
const app = express()
const cors = require("cors")

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

app.use(cookieParser())
app.use(cors())
connectDB()

app.use("/api", routes)

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'from express error handler middleware : ' + err.message })
})

app.listen(PORT, () => {
    console.log("server is running on port http://localhost:3000");
})