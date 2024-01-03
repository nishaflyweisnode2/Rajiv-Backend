const User = require("../Model/userModel");
const UserLocation = require("../Model/location");

const DriverDetail = require("../Model/driverDetail");

const dotenv = require("dotenv");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("config");
// const multer = require('multer');
const randomatic = require("randomatic");
const JWTkey = 'node5flyweis';
// const twilio = require('twilio');
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

exports.socialLogin = async (req, res) => {
  try {
    const { email, mobileNumber, name, loginType } = req.body;

    // Check if a user with the provided email or phone exists
    let user = await User.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
      role: "driver",
    });

    if (user) {
      // User found, generate a token
      const token = jwt.sign({ id: user._id }, JWTkey);
      return res.status(200).json({
        status: 200,
        msg: "Login successful",
        userId: user._id,
        token: token,
      });
    } else {
      // User not found, create a new user
      const newUser = await User.create({ name, mobileNumber, email, role: "driver",});

      if (newUser) {
        // New user created, generate a token
        const token = jwt.sign({ id: newUser._id }, JWTkey);
        return res.status(201).json({
          status: 201,
          msg: "User registered and logged in successfully",
          userId: newUser._id,
          token: token,
        });
      }
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};
exports.registerDriver = async (req, res) => {
  console.log("hi");
  try {
    const mobileNumber = req.body.mobileNumber;
    const altMobileNumber = req.body.altMobileNumber;
    const email = req.body.email;
    const name = req.body.name;

    const existingUser = await User.findOne({ mobileNumber,role: "driver" });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this mobile number already exists" });
    }

    // Generate OTP
    const otp = randomatic("0", 4); // Generate a 4-digit OTP

    // Save the generated OTP to the user's record in the database
    const user = await User.findOneAndUpdate(
      { mobileNumber, role: "driver", altMobileNumber,email,name },
      { otp },
      { new: true, upsert: true }
    );

    // Send OTP via SMS using Twilio
    // ...

    res.json({ message: "OTP sent successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtplogin = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    // console.log(mobileNumber);
    // console.log(otp);
    // Fetch the user's record from the database based on the mobile number
    const user = await User.findOne({ mobileNumber});
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

exports.loginDriver = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    let user = await User.findOne({ mobileNumber});

    if (!user) {
      // If the user is not found, register them
      const otp = randomatic("0", 4); // Generate a 4-digit OTP
      user = new User({
        mobileNumber,
        role: "driver",
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
exports.resendOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ mobileNumber, role: "driver" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const newOTP = randomatic("0", 4);

    // Update the user's record with the new OTP
    user.otp = newOTP;
    user.isVerified = false;
    await user.save();

    res.json({ message: "New OTP generated and sent to the user", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.latestBooking = async (req, res) => {
  try {
    const latestUserLocations = await UserLocation.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.status(200).json(latestUserLocations);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};

exports.getDriverDetails = async (req, res) => {
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
  
  exports.updateDriverProfile = async (req, res) => {
    const { id } = req.params;
    const { name, email, address } = req.body;
  
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
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user's profile fields
      user.name = name;
      user.email = email;
      user.address = address;
      user.profilePicture = image;
  
      // Save the updated user profile
      await user.save();
  
      res.json({ message: 'User profile updated successfully', user });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.acceptBooking = async (req, res) => {
  try {
    // Assuming the driver is authenticated and the driverId is available in req.user.id

    const locationId = req.params.locationId;
    console.log(locationId);
    // Update the status of the accepted user location to 'accepted' for the given driverId
    const updatedLocation = await UserLocation.findByIdAndUpdate(
      locationId,
      { $set: { driver: req.user.id, status: "accepted" } },
      { new: true } // Return the updated document
    );

    res
      .status(200)
      .json({
        message: "User location accepted successfully",
        updatedLocation,
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

exports.myBooking = async (req, res) => {
  try {
    // Retrieve accepted orders for the given driver
    const acceptedOrders = await UserLocation.find({
      driver: req.user.id,
      status: "accepted",
    }).populate("userId"); // Assuming you want to populate user details

    res.status(200).json({ acceptedOrders });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: error.message,
    });
  }
};

exports.startBooking = async (req, res) => {
  try {
    // Assuming the driver is authenticated and the driverId is available in req.user.id
    const { otp } = req.body;
    const locationId = req.params.locationId;
    const driverId = req.user.id;

    // Find the user location (booking) associated with the authenticated driver
    const location = await UserLocation.findOne({
      _id: locationId,
      driver: driverId,
    });

    if (!location) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (location.otp === otp) {
      location.otpVerifiedAt = new Date();
      await location.save();

      res.status(200).json({ message: 'Booking started successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};


exports.getBookingByDate = async (req, res) => {

try {
  // Get the selected date from the request parameters
  const selectedDate = new Date(req.params.selectedDate);

  // Set the start and end of the selected date
  const startDate = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endDate = new Date(selectedDate.setHours(23, 59, 59, 999));

  // Find orders within the selected date range
  const orders = await UserLocation.find({
    otpVerifiedAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  res.status(200).json({ success: true, orders });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
}
};




  exports.documentDriverDetail = async (req, res) => {
    try {
      // Assuming req.user contains the current user's ID
      const car = { ...req.body };
  
      // Create the data object with the required fields
      const data = {
        driver: req.user._id,
        city: req.body.city,
       ...req.body, // Wrap driverDetails in an object
      };
  
      // Log the processed data
      console.log("Processed Data:", data);
  
      // Save data using the DriverDetail model
      const detail = await DriverDetail.create(data);
  
      // Respond with success message and the created detail
      res.status(200).json({
        message: "Driver Details added successfully.",
        status: 200,
        data: detail,
      });
    } catch (error) {
      // Handle errors and respond with an error message
      console.error("Error:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: error.message,
      });
    }
  };

  
exports.driverImage = async (req, res) => {
  try {
    const driverId = req.params.driverId; // Corrected variable name
console.log(driverId);
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    upload.fields([
      { name: "interior", maxCount: 1 },
      { name: "exterior", maxCount: 1 },
      { name: "permit", maxCount: 1 },
      { name: "fitness", maxCount: 1 },
      { name: "insurance", maxCount: 1 },
      { name: "drivinglicense", maxCount: 1 },
      { name: "aadharCard", maxCount: 1 },
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

      // const detail = await DriverDetail.findById(driverId);
      // const detail = await DriverDetail.findOne({ driver: driverId });
      
      // if (!detail) {
      //   return res.status(404).json({ message: "DriverDetail details not found" });
      // }

      const updatedDetails = {
        interior: fileUrls.interior || detail.interior,
        exterior: fileUrls.exterior || detail.exterior,
        permit: fileUrls.permit || detail.permit,
        fitness: fileUrls.fitness || detail.fitness,
        insurance: fileUrls.insurance || detail.insurance,
        aadharCard: fileUrls.aadharCard || detail.aadharCard,
        drivinglicense: fileUrls.drivinglicense || detail.drivinglicense,
        cancelCheck: fileUrls.cancelCheck || detail.cancelCheck,
        bankStatement: fileUrls.bankStatement || detail.bankStatement,

      };
      console.log(updatedDetails);

      const updatedDriver = await DriverDetail.findOneAndUpdate({ driver: driverId }, updatedDetails, { new: true });


      res.status(200).json({
        message: "Details updated successfully.",
        status: 200,
        data: updatedDriver,
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