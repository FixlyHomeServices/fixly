const express = require("express");
const router = express.Router();
const axios = require("axios");
const ServiceRequest = require("./models/servicerequest");

const knowledgeBase = {
  "select a service":
    "Fixly offers plumbing, electrical, cleaning, and home repair services. Which one do you need?",
  "ask about refund policy":
    "Fixly provides full refunds for cancellations within 24 hours. Partial refunds may apply after that.",
  "how to book a service":
    "Search for a service, choose a provider, and confirm your booking online.",
  "contact support":
    "You can contact Fixly support via the website's Contact page.",
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
  "Ask about previous orders",
];

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
        max_tokens: 60,
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

router.post("/chat", async (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    const userEmail = req.body.email; // Passed from frontend
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
  } 
  // ✅ Handle previous orders — only if email is provided
  else if (userMessage.includes("previous order")) {
    if (!userEmail) {
      response = "Please log in to view your previous orders.";
      options = ["Ask something else", "No, I'm done"];
    } else {
      try {
        const orders = await ServiceRequest.find({ customerEmail: userEmail })
          .sort({ createdAt: -1 })
          .limit(3);

        if (orders.length > 0) {
          response =
            "Here are your recent services:\n" +
            orders
              .map(
                (order) =>
                  `Service: ${order.serviceCategory || order.service}, Date: ${order.createdAt.toDateString()}, Status: ${order.status || "N/A"}`
              )
              .join("\n");
        } else {
          response = "You don't have any previous orders yet.";
        }
        options = ["Ask something else", "No, I'm done"];
      } catch (err) {
        response = "I couldn't fetch your orders right now. Please try again later.";
        options = ["Ask something else", "No, I'm done"];
      }
    }
  } 
  // Check knowledge base
  else {
    for (const key in knowledgeBase) {
      if (userMessage.includes(key)) {
        response = knowledgeBase[key];
        options = ["Ask something else", "No, I'm done"];
        break;
      }
    }

    // Fallback to GPT
    if (!response) {
      response = await getAIResponse(userMessage);
      options = ["Ask something else", "No, I'm done"];
    }
  }

  res.json({ response, options });
});

module.exports = router;
