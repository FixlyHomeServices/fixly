const mongoose = require("mongoose");

const ServiceOfferingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  loc: {
    type: String,
    required: true,
  },
  name: {
    type: String, 
    required: true,
  },
  rating: {
    type: Number, 
    default: 0,
    min: 0,
    max: 5,
  },
  type: {
    type: String, 
    required: true,
  },
  priceRange: {
    type: String, 
    required: true,
  },
  reminder: {
    type: Boolean, 
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("ServiceOffering", ServiceOfferingSchema);
