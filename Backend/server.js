require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const axios = require("axios");
const fs = require("fs");

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

// Database connection
connectDB();

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/servicerequest", serviceRequestRoutes);


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
const shopsData = JSON.parse(fs.readFileSync("shopsData.json", "utf-8"));

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

// Backend API route: filter shops
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

// Chatbot knowledge base
const knowledgeBase = {
  "select a service":
    "Fixly offers plumbing, electrical, cleaning, and home repair services. Which one do you need?",
  "ask about refund policy":
    "Fixly provides full refunds for cancellations within 24 hours. Partial refunds may apply after that.",
  "how to book a service":
    "Search for a service, choose a provider, and confirm your booking online.",
  "contact support": "You can contact Fixly support via the website's Contact page.",
  "what is fixly":
    "Fixly connects you with trusted home service providers for repairs and maintenance.",
  "how does fixly work":
    "Fixly helps you search, compare, and book services with verified professionals.",
  "are fixly professionals verified":
    "Yes, all Fixly service providers go through a verification process.",
};

const mainOptions = [
  "Select a service",
  "Ask about refund policy",
  "How to book a service?",
  "Contact support",
];

// Fallback AI chatbot response
async function getAIResponse(query) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Keep answers brief (3 lines max).",
          },
          { role: "user", content: query },
        ],
        max_tokens: 50,
      },
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error getting AI response:", error.message);
    return "I couldn't process that right now. Try again later.";
  }
}

// Backend API route: chatbot
app.post("/backend/chat", async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let response = "";
  let options = mainOptions;

  if (userMessage.includes("ask something else")) {
    response = "Sure! What would you like to know?";
    options = mainOptions;
  } else if (
    userMessage.includes("no, i'm done") ||
    userMessage.includes("no i'm done")
  ) {
    return res.json({
      response: "Alright! Let me know if you need help anytime. 😊",
      options: [],
    });
  } else {
    for (const key in knowledgeBase) {
      if (userMessage.includes(key)) {
        response = knowledgeBase[key];
        options = ["Ask something else", "No, I'm done"];
        break;
      }
    }

    if (!response) {
      response = await getAIResponse(userMessage);
      options = ["Ask something else", "No, I'm done"];
    }
  }

  res.json({ response, options });
});

// ------------------ end merged backend ------------------ //

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});