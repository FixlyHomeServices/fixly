import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Load shop data from JSON file
const shopsData = JSON.parse(fs.readFileSync('shopsData.json', 'utf-8'));

// Function to extract JSON from OpenAI response
function extractJSON(text) {
  const match = text.match(/\[.*\]/s);
  return match ? JSON.parse(match[0]) : [];
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
  const filteredShops = await filterShopsWithAI(query);
  res.json(filteredShops);
});

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
