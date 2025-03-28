const express = require("express");
const router = express.Router();

const AddService = require("../models/services"); // Updated model import
const { verifyToken } = require("../middlewares/authmiddleware"); // Fixed path syntax

// Add a new service 
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { loc, name, type, reminder, priceRange, rating } = req.body;

    if (!loc || !name || !type || !priceRange) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const newService = new AddService({
      user: req.user.id, // Extracted from the token
      loc,
      name,
      type,
      priceRange,
      rating: rating || 0,
      reminder: reminder || false,
    });

    await newService.save();

    res
      .status(201)
      .json({
        message: "Service offering added successfully",
        service: newService,
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all services for a user
router.get("/my-services", verifyToken, async (req, res) => {
  try {
    const services = await AddService.find({ user: req.user.id });
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
