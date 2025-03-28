const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User making the request
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true }, // Service being requested
  // rating: { type: Number, default: null } // User rating after service completion
  price: { type: Number, required: true }, // Price agreed for the service
  status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" }, // Current request status
  timeSlot: { type: Date, required: true }, // Scheduled service time
  moredetails: { type: String, default: "" }, // Any additional resource/instruction
}, { timestamps: true });

const Request = mongoose.model("Request", RequestSchema);
module.exports = Request;
