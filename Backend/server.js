// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const apiRoutes = require("./routes/apiroutes");
// const serviceRequestRoutes = require("./routes/request");
// const addServicesRoutes = require("./routes/services"); // Updated from 'serviceofferings'
// const dashboardRoutes = require("./routes/dashboard");
// const cookieParser = require("cookie-parser");
// const serviceCategoryRoutes = require("./routes/serviceCategory");
// const chatRoutes = require("./routes/chatbot");

// const app = express();
// const PORT = 3001;

// // Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cookieParser());// Added cookie parser
// // Connect to Database
// connectDB();

// // Routes
// app.use("/api", apiRoutes);
// app.use("/auth", authRoutes);
// app.use("/request", serviceRequestRoutes);
// app.use("/services", addServicesRoutes); // Updated route path
// app.use("/dashboard", dashboardRoutes);
// app.use("/service-category", serviceCategoryRoutes);
// app.use("/chat", chatRoutes)
// app.get("/", (req, res) => {
//   res.send("Fixly Node.js server is running!");
// });

// app.get("/test", (req, res) => {
//   res.send("API is working!");
// });

// // Start the server (only once)
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const filterServicesWithAI = require("./filterServices"); // Import the filtration logic

// Route imports
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apiroutes");
const serviceRequestRoutes = require("./routes/request");
const addServicesRoutes = require("./routes/services");
const dashboardRoutes = require("./routes/dashboard");
const serviceCategoryRoutes = require("./routes/serviceCategory");
const chatbotRoutes = require("./chatbot");

const app = express();
const PORT = 3001;

// Allowed CORS origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser()); // Added cookie parser

// Connect to Database
connectDB();

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/request", serviceRequestRoutes);
app.use("/services", addServicesRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/service-category", serviceCategoryRoutes);
app.use("/chat", chatbotRoutes); // ✅ chatbot endpoint
 // Properly register to match frontend
 // Changed to match /api/chat route in frontend

// Service Filter Endpoint
app.post("/services/filter", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const filteredServices = await filterServicesWithAI(query);
  res.json(
    filteredServices.length
      ? filteredServices
      : [{ name: "No results found", rating: "N/A" }]
  );
});

// Health check routes
app.get("/", (req, res) => {
  res.send("Fixly Node.js server is running!");
});

app.get("/test", (req, res) => {
  res.send("API is working!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
