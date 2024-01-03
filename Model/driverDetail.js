const mongoose = require("mongoose");

const driverDetailSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Replace with your actual User model name
    // required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city", // Replace with your actual User model name
    // required: true,
  },
//   car: {
  dlno: String,
  dlDob: String,
  aadhar: String,

    client_id: String,
    rc_number: String,
    registration_date: Date,
    owner_name: String,
    father_name: String,
    present_address: String,
    permanent_address: String,
    mobile_number: String,
    vehicle_category: String,
    vehicle_chasi_number: String,
    vehicle_engine_number: String,
    maker_description: String,
    maker_model: String,
    body_type: String,
    fuel_type: String,
    color: String,
    norms_type: String,
    fit_up_to: Date,
    financer: String,
    financed: Boolean,
    insurance_company: String,
    insurance_policy_number: String,
    insurance_upto: Date,
    manufacturing_date: String,
    manufacturing_date_formatted: String,
    registered_at: String,
    latest_by: Date,
    less_info: Boolean,
    tax_upto: Date,
    tax_paid_upto: Date,
    cubic_capacity: String,
    vehicle_gross_weight: String,
    no_cylinders: String,
    seat_capacity: String,
    sleeper_capacity: String,
    standing_capacity: String,
    wheelbase: String,
    unladen_weight: String,
    vehicle_category_description: String,
    pucc_number: String,
    pucc_upto: Date,
    permit_number: String,
    permit_issue_date: Date,
    permit_valid_from: Date,
    permit_valid_upto: Date,
    permit_type: String,
    national_permit_number: String,
    national_permit_upto: Date,
    national_permit_issued_by: String,
    non_use_status: String,
    non_use_from: Date,
    non_use_to: Date,
    blacklist_status: String,
    noc_details: String,
    owner_number: String,
    rc_status: String,
    masked_name: Boolean,
    challan_details: String,
    variant: String,


    interior: {
      type: String,
      default: "", // Default value in case no file is uploaded
    },
    exterior: {
      type: String,
      default: "",
    },
    rc: {
      type: String,
      default: "",
    },
    fitness: {
      type: String,
      default: "",
    },
    permit: {
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
    cancelCheck: {
      type: String,
      default: "",
    },
    bankStatement: {
      type: String,
      default: "",
    },

    // Add other driver details fields as needed
//   },
});

const DriverDetail = mongoose.model("DriverDetail", driverDetailSchema);

module.exports = DriverDetail;
