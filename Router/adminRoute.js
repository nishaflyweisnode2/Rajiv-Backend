const express = require("express");
const {
  RegisterAdmin,
  loginAdmin,
  updateAdminProfile,
  allVendor,
  allDriver,
  allUser,
  getAdminDetails,
  deleteDriver,
  blockDriver,
  driverRide,
  unblockDriver,
  tripbyDate,
  acceptDriver
} = require("../Controller/adminController");
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

router.route("/register").post(RegisterAdmin);
router.route("/login").post(loginAdmin);
router.route("/detail/:id").put( upload.single('profilePicture'),updateAdminProfile);
router.route("/me").get(authJwt.verifyToken,getAdminDetails);

router.route("/all/vendor").get(allVendor);
router.route("/all/driver").get(allDriver);
router.route("/all/user").get(allUser);
router.route("/delete/driver/:id").delete(deleteDriver);
router.route("/block/driver/:id").put(blockDriver);
router.route("/unblock/driver/:id").put(unblockDriver);
router.route("/driver/ride/count/:driverId").get(driverRide);
router.route("/driver/accept/:userId").put(acceptDriver);
router.route("/driver/trip/date/:driverId/:date").get(tripbyDate);


module.exports = router;
