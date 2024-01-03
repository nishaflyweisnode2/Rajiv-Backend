const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const cloudinary = require("cloudinary");


app.use(cors());
app.use(express.json());
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/",(req,res)=>{
  res.send("Hello world")
})

// Route Imports
const user = require("./Router/userRoute");
const vendor = require("./Router/vendorRoute");
const vehicle = require("./Router/vehicleRoute");
const variant = require("./Router/variantRoute");
const terms = require("./Router/termsRoute");
const wallet = require("./Router/walletRoute");
const privacy = require("./Router/privacyRoute");
const cancel = require("./Router/cancelRoute");
const notify = require("./Router/notifyRoute");
const support = require("./Router/supportRoute");
const coupon = require("./Router/couponRoute");
const driver = require("./Router/driverRoute");
const admin = require("./Router/adminRoute");
const banner = require("./Router/bannerRoute");
const reason = require("./Router/reasonRoute");
const service = require("./Router/serviceRoute");
const subscription = require("./Router/subscriptionRoute");
const city = require("./Router/cityRoute");
const category = require("./Router/categoryRoute");



app.use("/api/v1/user", user);
app.use("/api/v1/vendor", vendor);
app.use("/api/v1/vehicle", vehicle);
app.use("/api/v1/variant", variant);
app.use("/api/v1/terms", terms);
app.use("/api/v1/wallet", wallet);
app.use("/api/v1/privacy", privacy);
app.use("/api/v1/cancel", cancel);
app.use("/api/v1/notify", notify);
app.use("/api/v1/support", support);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/driver", driver);
app.use("/api/v1/admin", admin);
app.use("/api/v1/banner", banner);
app.use("/api/v1/reason", reason);
app.use("/api/v1/service", service);
app.use("/api/v1/subscription", subscription);
app.use("/api/v1/city", city);
app.use("/api/v1/category", category);




dotenv.config({ path: "config/config.env" });
const mongoose = require("mongoose");


connectDatabase = () => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI)
      .then((con) =>
        console.log(`Mongodb connected with server: ${con.connection.host}`)
      );
  };
  
  // Connecting to database
  connectDatabase();
  
  const server = app.listen(process.env.PORT, () => {
      console.log(`Server is working on port ${process.env.PORT}`);
    }); 