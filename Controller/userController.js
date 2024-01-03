const User = require("../Model/userModel");
const UserLocation = require("../Model/location");


const dotenv = require("dotenv");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("config");
// const multer = require('multer');
const randomatic = require("randomatic");
const cloudinary = require("cloudinary").v2;
// const twilio = require('twilio');
const bcrypt = require("bcryptjs");
// Initialize Twilio client
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );
cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, gender, mobileNumber, birthday } = req.body;

    // Check if user with the mobile number already exists
    const existingUser = await User.findOne({ mobileNumber, role: "user" });

    if (existingUser) {
      return res.status(400).json({ error: "User with this mobile number already exists" });
    }

    // Generate OTP
    const otp = randomatic("0", 4); // Generate a 4-digit OTP

    // Save the generated OTP to the user's record in the database
    const user = await User.findOneAndUpdate(
      { mobileNumber },
      { name, email, gender, birthday, otp },
      { new: true, upsert: true }
    );

    // Send OTP via SMS using Twilio or your preferred SMS service
    // ...

    res.json({ message: "OTP sent successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    // console.log(mobileNumber);
    // console.log(otp);
    // Fetch the user's record from the database based on the mobile number
    const user = await User.findOne({ mobileNumber });
    // console.log(user);
    if (!user) {
      // User not found, handle accordingly
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided OTP matches the one saved in the user's record
    if (user.otp !== otp) {
      // Invalid OTP, handle accordingly
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid, save the user in the database
    user.isVerified = true;
    await user.save();

    // Check if the user is verified
    if (user.isVerified) {
      // Generate a JWT token
      // const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
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

exports.loginUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // If the user is not found, register them
      const otp = randomatic("0", 4); // Generate a 4-digit OTP
      user = new User({
        mobileNumber,
        otp,
      });

      // Save the user to the database
      await user.save();

      // Send OTP to the user via SMS or any other preferred method
      // Example: SMSService.sendOTP(mobileNumber, otp);

      res.json({ message: "OTP generated and sent to the user", user });
    } else {
      // If the user already exists, generate a new OTP
      const otp = randomatic("0", 4); // Generate a new 4-digit OTP
      user.otp = otp;
      user.isVerified = false;

      // Save the updated OTP to the user's record in the database
      await user.save();

      // Send the new OTP to the user via SMS or any other preferred method
      // Example: SMSService.sendOTP(mobileNumber, otp);

      res.json({ message: "New OTP generated and sent to the user", user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtplogin = async (req, res) => {
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

exports.getUserDetails = async (req, res) => {
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

exports.addLocation = async (req, res) => {

try {
  const {  pickup, drop } = req.body;
const userId =req.user.id;
  const userLocation = await UserLocation.create({
    userId:userId,
    pickup,
    drop,
  });

  res.status(201).json(userLocation);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
};


exports.chooseCar = async (req, res) => {
  console.log("hi");
  try {
    const { carId, date, time } = req.body;
    console.log(req.body);
    const locationId = req.params.locationId;

    // Generate a 4-digit OTP
    const otp = randomatic('0', 4);

    const userLocation = await UserLocation.findByIdAndUpdate(
      locationId,
      { $set: { car: carId, date: date, time: time, otp: otp } },
      { new: true }
    );
    

    if (!userLocation) {
      return res.status(404).json({ message: 'User location not found' });
    }

    res.status(200).json({ userLocation, otp });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};