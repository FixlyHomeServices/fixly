const express = require("express");
const router = express.Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, fullName, email, mobile, roles } = req.body;

    // Validate request
    if (!fullName || (!email && !mobile) ) {
      console.log("Validation failed:", { fullName, email, mobile, roles });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (!user) {
      user = new User({ username, fullName, email, mobile, roles });
    }
    console.log(user);

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60000); // OTP valid for 5 min
    await user.save();

    // Send OTP via Email
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Fixly OTP",
        text: `Your OTP is ${otp}`,
      });
    }

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/request-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body;
    console.log(req.body);

    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or Mobile is required" });
    }

    let user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60000); // OTP valid for 5 minutes
    await user.save();

    // Send OTP via Email
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Fixly Login OTP",
        text: `Your OTP is ${otp}`,
      });
    }

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp || !email) {
      console.log("Validation failed:", { email, otp });
      return res.status(400).json({ message: "OTP and contact info required" });
    }

    // Find user
    const user = await User.findOne({ $or: [{ email }] });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Clear OTP after successful login
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Profile Route
router.get("/profile",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;