import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';

// Initialize Express
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Load shop data from JSON file
const shopsData = JSON.parse(fs.readFileSync('shopsData.json', 'utf-8'));

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

// Function to filter shops using OpenAI
async function filterShopsWithAI(query) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an AI that filters shops based on user queries. Return JSON only.' },
          { role: 'user', content: `Here is the shop data: ${JSON.stringify(shopsData)}. \n\nFilter shops based on this query: "${query}". Return JSON only.` }
        ],
        max_tokens: 300
      },
      {
        headers: { 'Authorization': `Bearer ${openaiApiKey}` }
      }
    );

    return extractJSON(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error.message);
    return [];
  }
}

// API Route for filtering shops
app.post('/filter', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const filteredShops = await filterShopsWithAI(query);
  res.json(filteredShops.length ? filteredShops : [{ name: "No results found", rating: "N/A" }]);
});

// Chatbot knowledge base
const knowledgeBase = {
  "select a service": "Fixly offers plumbing, electrical, cleaning, and home repair services. Which one do you need?",
  "ask about refund policy": "Fixly provides full refunds for cancellations within 24 hours. Partial refunds may apply after that.",
  "how to book a service": "Search for a service, choose a provider, and confirm your booking online.",
  "contact support": "You can contact Fixly support via the website's Contact page.",
  "what is fixly": "Fixly connects you with trusted home service providers for repairs and maintenance.",
  "how does fixly work": "Fixly helps you search, compare, and book services with verified professionals.",
  "are fixly professionals verified": "Yes, all Fixly service providers go through a verification process.",
};

// Default chatbot options
const mainOptions = [
  "Select a service",
  "Ask about refund policy",
  "How to book a service?",
  "Contact support",
];

// Function to get a brief response from OpenAI when chatbot doesn't recognize a query
async function getAIResponse(query) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Keep answers brief (3 lines max).' },
          { role: 'user', content: query }
        ],
        max_tokens: 50
      },
      {
        headers: { 'Authorization': `Bearer ${openaiApiKey}` }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error getting AI response:', error.message);
    return "I couldn't process that right now. Try again later.";
  }
}

// Chatbot API route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let response = "";
  let options = mainOptions;

  if (userMessage.includes("ask something else")) {
    response = "Sure! What would you like to know?";
    options = mainOptions;
  } else if (userMessage.includes("no, i'm done") || userMessage.includes("no i'm done")) {
    return res.json({ response: "Alright! Let me know if you need help anytime. 😊", options: [] });
  } else {
    for (const key in knowledgeBase) {
      if (userMessage.includes(key)) {
        response = knowledgeBase[key];
        options = ["Ask something else", "No, I'm done"];
        break;
      }
    }
    
    // If no predefined response, ask OpenAI
    if (!response) {
      response = await getAIResponse(userMessage);
      options = ["Ask something else", "No, I'm done"];
    }
  }

  res.json({ response, options });
});

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
