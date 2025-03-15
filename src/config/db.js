const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://codehers:hemambika111@cluster0.vf5vwa0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, 
      family: 4 
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
