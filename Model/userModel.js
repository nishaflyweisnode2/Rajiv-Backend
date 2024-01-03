const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
  },
  altMobileNumber: {
    type: String,
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  noOfVehicle: {
    type: String,
  },
  gender: {
    type: String,
  },
  birthday: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending', // You can set a default status if needed
  },
  profilePicture: {
    type: String,
    default: "",
  },
  loginType: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin", "driver", "vendor"],
    default: "user",
  },
  isBlock: {
    type: Boolean,
    default: false, // Set default value if not provided
  },
  wallet: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
