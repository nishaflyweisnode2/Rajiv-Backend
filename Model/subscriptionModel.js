// Import necessary libraries
const mongoose = require("mongoose");

// Define a schema for the Subscription model
const subscriptionSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    type: {
      type: String,
      enum: ["monthly", "hourly", "yearly", "airport"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt
  }
);

// Create a Subscription model
const Subscription = mongoose.model("Subscription", subscriptionSchema);

// Export the model
module.exports = Subscription;
