require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
const axios = require("axios");
const connectDB = require("./config/db"); // Import DB connection
const ServiceOffering = require("./models/services"); // Import ServiceOffering model

// Connect to MongoDB
connectDB();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Function to extract JSON from OpenAI response
function extractJSON(text) {
  const match = text.match(/\[.*\]/s); // Match JSON-like array
  try {
    return match ? JSON.parse(match[0]) : [];
  } catch (error) {
    console.error("Error parsing JSON from AI response:", error.message);
    return [];
  }
}

async function getRecommendations() {
  try {
    const orders = JSON.parse(fs.readFileSync("past_orders2.json", "utf-8"));
    const providers = await ServiceOffering.find({ rating: { $gte: 4 } }) // Fetch providers dynamically
      .select("name type rating priceRange loc")
      .lean();

    const prompt = `
    You are a smart recommendation assistant.

    Below is the user's past order history:
    ${JSON.stringify(orders, null, 2)}

    Below is the list of top-rated service providers by category (use these if fallback is needed):
    ${JSON.stringify(providers, null, 2)}

    Your task:
    - Recommend 3 services that the user is likely to need now.
    - Recommend services based on:
      - Periodic needs (e.g., AC servicing every 6 months).
      - Complementary services (e.g., after sofa cleaning, suggest curtain cleaning or deep cleaning).
      - Discounts preference if they have used discounts frequently.
      - Seasonal recommendations (like pest control before monsoon).
      - Do NOT recommend services done in the last 3 months.
    - For each recommendation, also suggest a service provider:
      - If the user rated a provider 4 or 5 for similar services, suggest the same provider.
      - If no past provider is found, choose the highest-rated provider from the provider list for that service category.
      - Do not recommend providers rated below 4.

    Return **ONLY** JSON in this format:
    [
      {
        "service": "",
        "reason": "",
        "suggested_offer": "",
        "suggested_provider": ""
      }
    ]
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a recommendation assistant that understands order patterns and preferences. Return only JSON with no additional text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract only the JSON part of the response
    const recommendations = extractJSON(response.data.choices[0].message.content);
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error.message);
    return [];
  }
}

module.exports = { getRecommendations };
