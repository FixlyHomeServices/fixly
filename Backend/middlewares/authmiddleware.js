const jwt = require("jsonwebtoken");

const blacklistedTokens = new Set(); // Store revoked tokens in memory (use Redis for production)

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  //  Check if token is blacklisted
  if (blacklistedTokens.has(token)) {
    return res.status(403).json({ message: "Token is invalid. Please log in again." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};


// Logout function added 
//  Logout Function: Add token to blacklist
const logout = (req, res) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  blacklistedTokens.add(token); //  Add token to blacklist

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { verifyToken, logout };
