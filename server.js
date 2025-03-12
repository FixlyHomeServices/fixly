require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./src/middlewares/googleauth");

const authRoutes = require("./src/routes/auth");
const apiRoutes = require("./src/routes/apiroutes");
const serviceRequestRoutes = require("./src/routes/servicerequest");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Session setup for Google OAuth
app.use(
  session({
    secret: process.env.JWT_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Start the server (only once)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
