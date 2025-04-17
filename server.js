require("dotenv").config()

const cookieParser = require("cookie-parser")
const express = require("express")
const connectDB = require("./db")
const routes = require("./routes")
const app = express()
const cors = require("cors")
const morgan = require("morgan");
const { default: helmet } = require("helmet")

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(helmet())

app.use(morgan("dev")); // concise output with method, status, URL, and response time
app.use(cookieParser())
app.use(cors())

connectDB()

app.use("/api", routes)

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'error handler : ' + err.message })
})

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => {
    console.log("server is running on port http://localhost:3000");
})