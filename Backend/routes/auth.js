const express = require("express");
const router = express.Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");

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

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const {username, fullName, email, mobile, roles } = req.body;
    
    // Validate request
    if (!fullName || (!email && !mobile) || !roles) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (!user) {
      user = new User({username, fullName, email, mobile, roles });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60000); // OTP valid for 5 min
    await user.save();

    // Send OTP via Email
    // if (email) {
    //   await transporter.sendMail({
    //     from: process.env.EMAIL_USER,
    //     to: email,
    //     subject: "Your Fixly OTP",
    //     text: `Your OTP is ${otp}`,
    //   });
    // }
    // if (email) {
    //   await transporter.sendMail({
    //     from: process.env.EMAIL_USER,
    //     to: email,
    //     subject: "Your Fixly OTP",
    //     text: `Your OTP is ${otp}`,
    //   });
    // }

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;


// Login Route
router.post("/login", async (req, res) => {
      try {
        const { mobile, email, otp } = req.body;
    
        if (!otp || (!mobile && !email)) {
          return res.status(400).json({ message: "OTP and contact info required" });
        }
    
        // Find user
        const user = await User.findOne({ $or: [{ email }, { mobile }] });
    
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


// Route to initiate Google Authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Authentication Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // Generate JWT Token
      const token = jwt.sign(
        { id: req.user._id, roles: req.user.roles },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(`http://localhost:5002?token=${token}`); // Redirect to frontend with token
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Google authentication failed" });
    }
  }
);

module.exports = router;