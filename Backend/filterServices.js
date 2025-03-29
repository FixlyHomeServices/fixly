const axios = require("axios");
const { ServiceCategory } = require("./models/serviceCatageroy"); // Import ServiceCategory model

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

// Function to filter services using OpenAI and MongoDB query (accepts `app` parameter)
function filterServicesWithAI(app) {
  app.post("/services/filter", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
      console.log("Original user query:", query);

      // Example OpenAI API logic: you can adjust the following part if needed
      const aiFormattedQuery = query; // No OpenAI call here; add if needed
      console.log("AI-formatted query:", aiFormattedQuery);

      // Fetch services from MongoDB using regex-based search for flexibility
      const services = await ServiceCategory.find({
        $or: [
          { "services.title": { $regex: aiFormattedQuery, $options: "i" } },
          { "featuredServices.title": { $regex: aiFormattedQuery, $options: "i" } },
          { "homeServices.title": { $regex: aiFormattedQuery, $options: "i" } },
        ],
      });

      console.log("Services returned from MongoDB:", services);

      // Send the filtered results, or "No results found" if empty
      res.json(services.length ? services : [{ name: "No results found", rating: "N/A" }]);
    } catch (error) {
      console.error("Error fetching services with AI:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  });
}

module.exports = filterServicesWithAI;
