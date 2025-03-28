const express = require('express');
const router = express.Router();
// const Dashboard = require('../models/dashboard');
const auth = require('../middlewares/authmiddleware');
const User = require('../models/users');
const ServiceRequest = require('../models/request');
const { verifyToken } = require("../middlewares/authmiddleware");



// customer :
//total requests sent 
//total types
//pending requests
//accepted
//completed requests 
//cancelled requests 

//serviceprovider :
//totalservices
//types
//pending requests
//accepted
//completed requests 
//cancelled requests 




// Get dashboard data
// router.get('/', auth, asyncHandler(async (req, res) => {
//   const dashboard = await Dashboard.findOne({ userId: req.user._id });
//   if (!dashboard) {
//     return res.status(404).json({ message: 'Dashboard not found' });
//   }
//   res.json(dashboard);
// }));


// Update service provider availability
// router.patch('/availability', auth, asyncHandler(async (req, res) => {
//   if (req.user.userType !== 'provider') {
//     return res.status(403).json({ message: 'Not authorized' });
//   }

//   const dashboard = await Dashboard.findOneAndUpdate(
//     { userId: req.user._id },
//     { 'metrics.isAvailable': req.body.isAvailable },
//     { new: true }
//   );

//   res.json(dashboard);
// }));

// Get quick stats
router.get("/quick-stats", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let stats = {};

    if (user.roles.includes("customer")) {
      stats.totalRequestsSent = await ServiceRequest.countDocuments({ requestingUser: user._id });
      stats.totalTypes = await ServiceRequest.distinct("services", { requestingUser: user._id });
      stats.pendingRequests = await ServiceRequest.countDocuments({ requestingUser: user._id, status: "pending" });
      stats.acceptedRequests = await ServiceRequest.countDocuments({ requestingUser: user._id, status: "accepted" });
      stats.completedRequests = await ServiceRequest.countDocuments({ requestingUser: user._id, status: "completed" });
      stats.cancelledRequests = await ServiceRequest.countDocuments({ requestingUser: user._id, status: "cancelled" });
    } else if (user.roles.includes("serviceProvider")) {
      const services = await Service.find({ user: user._id }).select("_id");
      const serviceIds = services.map(service => service._id);
      stats.totalServices = await ServiceRequest.countDocuments({ service: { $in: serviceIds } });
      stats.types = await ServiceRequest.distinct("services", { service: { $in: serviceIds } });
      stats.pendingRequests = await ServiceRequest.countDocuments({ service: { $in: serviceIds }, status: "pending" });
      stats.acceptedRequests = await ServiceRequest.countDocuments({ service: { $in: serviceIds }, status: "accepted" });
      stats.completedRequests = await ServiceRequest.countDocuments({ service: { $in: serviceIds }, status: "completed" });
      stats.cancelledRequests = await ServiceRequest.countDocuments({ service: { $in: serviceIds }, status: "cancelled" });
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/profile",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
