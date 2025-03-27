require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const axios = require("axios");
const connectDB = require("./config/db");
const passport = require("./middlewares/googleauth");
//const passport = require('passport');
const { getRecommendations } = require("./recommendation.js");



const path = require("path");

// Route imports
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apiroutes");
const serviceRequestRoutes = require("./routes/servicerequest");
const serviceOfferingRoutes = require("./routes/serviceofferings");
const chatbotRoutes = require("./chatbot");

const ServiceOffering = require("./models/serviceofferings");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Database connection
connectDB();

// Session for Google OAuth
app.use(
  session({
    secret: process.env.JWT_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/servicerequest", serviceRequestRoutes);
app.use("/serviceofferings", serviceOfferingRoutes);
app.use("/backend", chatbotRoutes);

// Function to extract JSON from OpenAI response
function extractJSON(text) {
  const match = text.match(/\[.*\]/s);
  try {
    return match ? JSON.parse(match[0]) : [];
  } catch (error) {
    console.error("Error parsing JSON from AI response:", error.message);
    return [];
  }
}

// Function to filter services with OpenAI
async function filterServicesWithAI(query) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const servicesData = await ServiceOffering.find({}); // Fetch all services
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that filters service offerings based on user queries. Return JSON only.",
          },
          {
            role: "user",
            content: `Here is the service offerings data: ${JSON.stringify(
              servicesData
            )}.\n\nFilter the service offerings based on this query: "${query}". Return JSON only.`,
          },
        ],
        max_tokens: 500,
      },
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` },
      }
    );

    return extractJSON(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching data from OpenAI or DB:", error.message);
    return [];
  }
}

// Filter services endpoint
app.post("/backend/filter", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const filteredServices = await filterServicesWithAI(query);
  res.json(
    filteredServices.length
      ? filteredServices
      : [{ name: "No results found", rating: "N/A" }]
  );
});

// Test routes
app.get("/", (req, res) => {
  res.send("Fixly Node.js server is running!");
});

app.get("/test", (req, res) => {
  res.send("API is working!");
});

app.get("/backend/recommendations", async (req, res) => {
  try {
    const recommendations = await getRecommendations();
    res.json({ recommendations });
  } catch (error) {
    console.error("Error getting recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
