require("dotenv").config();
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const passport = require("../auth/googleauth");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // To handle JSON requests

// Import and use routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);  // All routes will start with "/api"

app.get("/", (req, res) => {
  res.send("Fixly Node.js server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const connectDB = require("./db");
connectDB();

app.use(bodyParser.json());
app.use("/auth", authRoutes);


const serviceRequestRoutes = require("./routes/servicerequest");
app.use("/service-request", servicerequestRoutes);



// Session setup (needed for Google OAuth)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(5001, () => console.log("Server running on port 5001"));