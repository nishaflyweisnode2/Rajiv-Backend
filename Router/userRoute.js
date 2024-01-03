const express = require("express");
const {
  registerUser, loginUser,registerAdmin,addLocation,verifyAdmin,deleteUser,chooseCar, loginAdmin,logout,verifyadminlogin, getUserDetails, verifyOtp,verifyOtplogin,updateProfile
} = require("../Controller/userController");
const authJwt = require("../middleware/authJwt");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/verify/otp").post(verifyOtp);

router.route("/login").post(loginUser);
router.route("/verify/login").post(verifyOtplogin);


router.route("/me").get(  authJwt.verifyToken,getUserDetails);
router.route("/detail/:id").put(updateProfile);

router.route("/location").post( authJwt.verifyToken,addLocation);
router.route("/choose/car/:locationId").put(chooseCar);


module.exports = router;