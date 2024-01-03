const mongoose = require('mongoose');

const userLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace with the actual user model name
  
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorDetail', // Replace with the actual user model name
   
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace with your actual Driver model name
    // required: true,
  },
  status: {
    type: String,
    default: 'pending', // You can set a default status if needed
  },
  date: {
    type: String,
   
  },
  otpVerifiedAt: {
    type: String,
   
  },
  time: {
    type: String,
   
  },
  otp: {
    type: String,
  },
  pickup: {
    latitude: {
      type: Number,
     
    },
    longitude: {
      type: Number,
  
    },
    address: {
      type: String,
     
    },
  },
  drop: {
    latitude: {
      type: Number,
      
    },
    longitude: {
      type: Number,
    
    },
    address: {
      type: String,
    
    },
  },
  current: {
    latitude: {
      type: Number,
      default: 0, // Set your desired default value
    },
    longitude: {
      type: Number,
      default: 0, // Set your desired default value
    },
    address: {
      type: String,
      default: "", // Set your desired default value
    },
  },
  

}, { timestamps: true }); 
module.exports = mongoose.model('UserLocation', userLocationSchema);
