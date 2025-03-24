require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apiroutes");
const serviceRequestRoutes = require("./routes/servicerequest");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

// Connect to Database
connectDB();

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/servicerequest", serviceRequestRoutes);

app.get("/", (req, res) => {
  res.send("Fixly Node.js server is running!");
});

app.get("/test", (req, res) => {
  res.send("API is working!");
});

// Start the server (only once)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});