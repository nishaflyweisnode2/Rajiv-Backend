const User = require("../Model/userModel");
const vendorDetail = require("../Model/vendorDetail");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
require("dotenv").config({ path: "./config/config.env" });
const UserLocation = require("../Model/location");

const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("config");
exports.RegisterAdmin = async (req, res, next) => {
  console.log("hi1");
  try {
    const { email, password } = req.body;

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email, role: "admin" });

    if (existingUser) {
      return res
        .status(409)
        .json({ status: 409, message: "admin already exists", data: {} });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    // Create a new vendor user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    // Generate JWT token for authentication
    const token = jwt.sign({ id: newUser._id }, "node5flyweis");

    // Return response
    const responseData = {
      _id: newUser._id,
      newUser,
      token,
    };

    res
      .status(201)
      .json({
        status: 201,
        message: "ADMIN registered successfully",
        data: responseData,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, message: "Server error" + error.message });
  }
};
exports.loginAdmin = async (req, res) => {
  console.log("hi");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, role: "admin" });
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .send({ status: 404, message: "user not found ! not registered" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Wrong password" });
    }
    // const accessToken = jwt.sign({ id: user._id }, authConfig.secret, { expiresIn: authConfig.accessTokenTime, });
    const token = jwt.sign({ id: user._id }, "node5flyweis");
    let obj = {
      _id: user._id,
      token: token,
      user,
    };
    res
      .status(200)
      .send({
        status: 200,
        message: "admin logged in successfully",
        data: obj,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
};
exports.updateAdminProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, gender, birthday, mobileNumber } = req.body;

  try {
    let image;

    // Check if there is an uploaded file
    if (req.file) {
      image = req.file.path;
    }
    console.log(req.file);
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile fields
    user.name = name;
    user.email = email;
    user.address = address;
    user.profilePicture = image;
    user.gender = gender;
    user.birthday = birthday;
    user.mobileNumber = mobileNumber;

    // Save the updated user profile
    await user.save();

    res.json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getAdminDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, role: "admin" });

    if (!user) {
      res.status(404).send({
        status: 404,
        message: "Admin not found",
        data: {},
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "Get admin profile",
        data: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.allVendor = async (req, res) => {
  try {
    // Query for users with role "vendor"
    const vendors = await User.find({ role: "vendor" });

    res.json({ success: true, vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.allDriver = async (req, res) => {
  try {
    // Query for users with role "vendor"
    const vendors = await User.find({ role: "driver" });

    res.json({ success: true, vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
exports.allUser = async (req, res) => {
  try {
    // Query for users with role "vendor"
    const vendors = await User.find({ role: "user" });

    res.json({ success: true, vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
exports.deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.id;

    // Check if the driver exists
    const existingDriver = await User.findById(driverId);
    if (!existingDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Delete the driver
    await User.findByIdAndDelete(driverId);

    res.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.blockDriver = async (req, res) => {
  try {
    const driverId = req.params.id;

    // Check if the driver exists
    const existingDriver = await User.findById(driverId);
    if (!existingDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update isBlock to true
    existingDriver.isBlock = true;
    await existingDriver.save();

    res.json({ message: "Driver is blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.unblockDriver = async (req, res) => {
  try {
    const driverId = req.params.id;

    // Check if the driver exists
    const existingDriver = await User.findById(driverId);
    if (!existingDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update isBlock to true
    existingDriver.isBlock = false;
    await existingDriver.save();

    res.json({ message: "Driver is Unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.driverRide = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // Count the number of rides with the specified driver ID
    const rideCount = await UserLocation.countDocuments({ driver: driverId });

    res.json({ rideCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptDriver = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and update the status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: "accepted" }, // Assuming 'status' is the field to be updated
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.tripbyDate = async (req, res) => {
  try {
    const { driverId, date } = req.params;

    // Convert the date string to a JavaScript Date object
    const searchDate = new Date(date);
console.log(searchDate);
    // Find orders for the specified driver and date
    const orders = await UserLocation.find({
      driver: driverId,
      // Convert otpVerifiedAt to a Date object for comparison
      otpVerifiedAt: { $eq: searchDate},
    });

    res.json({ acceptedOrders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
