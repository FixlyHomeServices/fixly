const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/servicerequest");
const { verifyToken } = require("../middlewares/authmiddleware");

//  Create a new service request
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { serviceId, serviceProviderId, price, timeSlot, resource } = req.body;

    if (!serviceId || !serviceProviderId || !price || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new ServiceRequest({
      requestingUser: req.user.id,
      serviceProvider: serviceProviderId,
      service: serviceId,
      price,
      timeSlot,
      resource: resource || "",
    });

    await newRequest.save();
    res.status(201).json({ message: "Service request created successfully", request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//  Get all requests made by a user
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ requestingUser: req.user.id })
      .populate("serviceProvider", "fullName email")
      .populate("service", "name type");
      
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all requests assigned to a service provider
router.get("/provider-requests", verifyToken, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ serviceProvider: req.user.id })
      .populate("requestingUser", "fullName email")
      .populate("service", "name type");

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update request status (accept, complete, cancel)
router.put("/update-status/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (req.user.id !== request.serviceProvider.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = status;
    await request.save();
    res.status(200).json({ message: "Status updated successfully", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
