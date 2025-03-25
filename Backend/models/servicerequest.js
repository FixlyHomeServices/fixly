const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  requestingUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceOffering", required: true },
  rating: { type: Number, default: null },
  price: { type: Number, required: true },
  status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
  timeSlot: { type: Date, required: true },
  resource: { type: String, default: "" },
}, { timestamps: true });

// ✅ Always check if already defined
module.exports = mongoose.models.ServiceRequest || mongoose.model("ServiceRequest", serviceRequestSchema);
