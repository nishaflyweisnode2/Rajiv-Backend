const User = require("../Model/userModel");
const vendorDetail = require("../Model/vendorDetail");

const dotenv = require("dotenv");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("config");
const randomatic = require("randomatic");

const bcrypt = require("bcryptjs");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});

const upload = multer({ storage: storage });

exports.registerVendor = async (req, res) => {
  try {
    const { mobileNumber, ...data } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ mobileNumber, role: "vendor" });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this mobile number already exists" });
    }

    // Generate OTP
    const otp = randomatic("0", 4); // Generate a 4-digit OTP

    // Save the generated OTP to the user's record in the database
    const user = await User.findOneAndUpdate(
      { mobileNumber, role: "vendor" },
      { ...data, otp },
      { new: true, upsert: true }
    );

    res.json({ message: "OTP sent successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.verifyOtpVendor = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    const user = await User.findOne({ mobileNumber, role: "vendor" });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid, save the user in the database
    user.isVerified = true;
    await user.save();

    // Check if the user is verified
    if (user.isVerified) {
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      res.json({ message: "OTP verification successful.", token, user });
    } else {
      res.status(401).json({ error: "User not verified" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginVendor = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const otp = randomatic("0", 4);
    console.log(otp);
    user.otp = otp;
    user.isVerified = false;

    // Save the updated OTP to the user's record in the database
    await user.save();

    res.json({ message: "New OTP generated and sent to the user", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.otpVendorlogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Find the user based on the mobile number
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the OTP matches
    if (otp === user.otp) {
      // Generate a JWT token
      //   const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      // Clear the OTP from the user's record in the database
      user.otp = undefined;
      user.isVerified = true;
      await user.save();

      res.json({ message: "OTP verification successful.", user, token });
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getVendorDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res
        .status(404)
        .send({ status: 404, message: "user not found ", data: {} });
    } else {
      res
        .status(200)
        .send({ status: 200, message: "get profile ", data: user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile fields
    user.name = name;
    user.email = email;
    user.address = address;

    // Save the updated user profile
    await user.save();

    res.json({ message: "User profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.documentDetail = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    upload.fields([
      { name: "interior", maxCount: 1 },
      { name: "exterior", maxCount: 1 },
      { name: "rc", maxCount: 1 },
      { name: "fitness", maxCount: 1 },
      { name: "insurance", maxCount: 1 },
      { name: "aadharCard", maxCount: 1 },
      { name: "drivinglicense", maxCount: 1 },
      { name: "insuranceExp", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      const fileUrls = {};
      for (const field in req.files) {
        if (req.files[field] && req.files[field][0]) {
          fileUrls[field] = req.files[field][0].path;
        }
      }

      const carDetails = {
        // vendor:req.user.id,
        vehicle: req.body.vehicle,
        variant: req.body.variant,
        interior: fileUrls.interior || "",
        exterior: fileUrls.exterior || "",
        rc: fileUrls.rc || "",
        fitness: fileUrls.fitness || "",
        insurance: fileUrls.insurance || "",
        drivinglicense: fileUrls.drivinglicense || "",
        aadharCard: fileUrls.aadharCard || "",
        insuranceExp: fileUrls.insuranceExp || "",
      };

      const data = {
        vendor: req.user._id, // Assuming req.user contains the current user's ID
        name: req.body.name,
        carDetails: carDetails, // Wrap carDetails in an array
      };

      console.log("Processed Data:", data);

      const detail = await vendorDetail.create(data);
      res.status(200).json({
        message: "Details added successfully.",
        status: 200,
        data: detail,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};

exports.updateType = async (req, res) => {
  try {
    const { carId } = req.params;
    const { type } = req.body;

    // Validate input
    if (!type) {
      return res.status(400).json({ message: 'Car type is required' });
    }

    // Find and update the car
    const updatedCar = await vendorDetail.findByIdAndUpdate(
      carId,
      { $set: { type } },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Car type updated successfully', car: updatedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCarsByType = async (req, res) => {
  try {
    const { type } = req.params;

    // Find cars by type
    const cars = await vendorDetail.find({ type });

    res.status(200).json({ cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.carDetail = async (req, res) => {
  try {
    const vendorDetails = req.body;
    const vendor = req.user.id;

    // Assuming vendorDetails is an array of objects containing vendor details for multiple cars
    const detailsToSave = vendorDetails.map(detail => ({ ...detail, vendor }));

    const savedDetails = await vendorDetail.create(detailsToSave);

    res.status(201).json(savedDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateImage = async (req, res) => {
  try {
    const carId = req.params.carId; // Corrected variable name

    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    upload.fields([
      { name: "interior", maxCount: 1 },
      { name: "exterior", maxCount: 1 },
      { name: "permit", maxCount: 1 },
      { name: "fitness", maxCount: 1 },
      { name: "insurance", maxCount: 1 },
      { name: "cancelCheck", maxCount: 1 },
      { name: "bankStatement", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      const fileUrls = {};
      for (const field in req.files) {
        if (req.files[field] && req.files[field][0]) {
          fileUrls[field] = req.files[field][0].path;
        }
      }

      const detail = await vendorDetail.findById(carId);
      if (!detail) {
        return res.status(404).json({ message: "Car details not found" });
      }

      const updatedDetails = {
       
        interior: fileUrls.interior || detail.interior,
        exterior: fileUrls.exterior || detail.exterior,
        permit: fileUrls.permit || detail.permit,
        fitness: fileUrls.fitness || detail.fitness,
        insurance: fileUrls.insurance || detail.insurance,
        cancelCheck: fileUrls.cancelCheck || detail.cancelCheck,
        bankStatement: fileUrls.bankStatement || detail.bankStatement,
        aadharCard:  req.body.aadharCard || detail.aadharCard,
        rcNo:  req.body.rcNo || detail.rcNo,
        insuranceExp:  req.body.insuranceExp || detail.insuranceExp,
        dlNo:  req.body.dlNo || detail.dlNo,
        dlDob:  req.body.dlDob || detail.dlDob,
      };

      const updatedCar = await vendorDetail.findByIdAndUpdate(carId, updatedDetails, { new: true });

      res.status(200).json({
        message: "Details updated successfully.",
        status: 200,
        data: updatedCar,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};


exports.getAllCarDetails = async (req, res) => {
  console.log("hi");
  try {
    const allCarDetails = await vendorDetail.find();

    res.status(200).json(allCarDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

exports.getCarbyVendor = async (req, res) => {
  console.log("hi2");
  try {
    const vendorId = req.params.vendorId;
    const allCarDetails = await vendorDetail.find({ vendor: vendorId });
    res.status(200).json({ success: true, allCarDetails: allCarDetails });

    // res.status(200).json(allCarDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};





