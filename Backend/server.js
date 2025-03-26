require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const axios = require("axios");
const fs = require("fs");
const connectDB = require('./config/db');

// Route imports
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apiroutes");
const serviceRequestRoutes = require("./routes/servicerequest");
const chatbotRoutes = require("./chatbot"); // ✅ chatbot.js in same folder

const app = express();
const PORT = 3001;


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/servicerequest", serviceRequestRoutes);
app.use("/backend", chatbotRoutes); // ✅ chatbot endpoint


// Test routes
app.get("/", (req, res) => {
  res.send("Fixly Node.js server is running!");
});

app.get("/test", (req, res) => {
  res.send("API is working!");

});

app.get("/test", (req, res) => {
  res.send("API is working!");
});

// ---------------------- BACKEND (merged) ---------------------- //

// Load shops data from file
const path = require("path");
const shopsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../shopsData.json"), "utf-8"));


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

// Function to filter shops with OpenAI
async function filterShopsWithAI(query) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that filters shops based on user queries. Return JSON only.",
          },
          {
            role: "user",
            content: `Here is the shop data: ${JSON.stringify(
              shopsData
            )}. \n\nFilter shops based on this query: "${query}". Return JSON only.`,
          },
        ],
        max_tokens: 300,
      },
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` },
      }
    );

    return extractJSON(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching data from OpenAI:", error.message);
    return [];
  }
}

// Shop filter endpoint
app.post("/backend/filter", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const filteredShops = await filterShopsWithAI(query);
  res.json(
    filteredShops.length
      ? filteredShops
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
