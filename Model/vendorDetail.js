const mongoose = require("mongoose");

const vendorDetailSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Replace with your actual User model name
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: true,
  },
  interior: {
    type: String,
    default: "", // Default value in case no file is uploaded
  },
  exterior: {
    type: String,
    default: "",
  },
  permit: {
    type: String,
    default: "",
  },
  fitness: {
    type: String,
    default: "",
  },
  insurance: {
    type: String,
    default: "",
  },
  drivinglicense: {
    type: String,
    default: "",
  },
  aadharCard: {
    type: String,
    default: "",
  },
  insuranceExp: {
    type: String,
    default: "",
  },
  rcNo: {
    type: String,
    default: "",
  },
  dlNo: {
    type: String,
    default: "",
  },
  dlDob: {
    type: String,
    default: "",
  },
  cancelCheck: {
    type: String,
    default: "",
  },
  bankStatement: {
    type: String,
    default: "",
  },
});

const VendorDetail = mongoose.model("VendorDetail", vendorDetailSchema);

module.exports = VendorDetail;
