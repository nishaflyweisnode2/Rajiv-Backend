const express = require("express");
const {
  registerVendor,
  loginVendor,
  registerAdmin,
  verifyAdmin,
  deleteUser,
  loginAdmin,
  logout,
  verifyadminlogin,
  getUserDetails,
  verifyOtpVendor,
  otpVendorlogin,
  updateProfile,
  documentDetail,
  getVendorDetails,
  updateType,
  carDetail,
  updateImage,
  getAllCarDetails,
  getCarsByType,
  getCarbyVendor
} = require("../Controller/vendorController");
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
const authJwt = require("../middleware/authJwt");

// const authJwt = require("../middleware/authJwt");
const router = express.Router();
router.route("/register").post(registerVendor);
router.route("/verify/otp").post(verifyOtpVendor);

router.route("/login").post(loginVendor);
router.route("/verify/login").post(otpVendorlogin);
router.route("/document").post(  authJwt.verifyToken,documentDetail);
router.route("/type/:carId").put(updateType);
router.route("/get/:type").get(getCarsByType);

router.route("/document/car").post(  authJwt.verifyToken,carDetail);

router.route("/image/car/:carId").post(updateImage);

router.route("/available/get/car").get(getAllCarDetails);

router.route("/me").get(authJwt.verifyToken, getVendorDetails);
router.route("/detail/:id").put(updateProfile);

router.route("/car/my/:vendorId").get( getCarbyVendor);

module.exports = router;
