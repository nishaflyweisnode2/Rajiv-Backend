const express = require("express");
const {
  registerDriver, loginDriver,verifyOtplogin,socialLogin,driverImage,documentDriverDetail,latestBooking,getBookingByDate,resendOTP,updateDriverProfile,acceptBooking,myBooking,startBooking,getDriverDetails
} = require("../Controller/driverController");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
const authJwt = require("../middleware/authJwt");
const router = express.Router();
router.route("/register").post(registerDriver);

router.route("/login").post(loginDriver);
router.route("/verify/login").post(verifyOtplogin);
router.route("/resend/otp").post(resendOTP);
router.route("/google/login").post(socialLogin);
router.route("/me").get(  authJwt.verifyToken,getDriverDetails);
router.route("/detail/:id").put( upload.single('profilePicture'),updateDriverProfile);

router.route("/latest/booking").get(latestBooking);
router.route("/accept/booking/:locationId").put(authJwt.verifyToken,acceptBooking);
router.route("/my/booking").get(authJwt.verifyToken,myBooking);
router.route("/otp/booking/:locationId").post(authJwt.verifyToken,startBooking);


router.route("/date/booking/:selectedDate").get(getBookingByDate);
router.route("/detail/driver").post(  authJwt.verifyToken,documentDriverDetail);
router.route("/driver/image/:driverId").post(driverImage);


module.exports = router;