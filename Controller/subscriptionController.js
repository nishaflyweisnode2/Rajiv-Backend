const Subscription= require('../Model/subscriptionModel')
require('dotenv').config();

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dbrvq9uxa",
  api_key: "567113285751718",
  api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});

const upload = multer({ storage: storage });
exports.AddSubscription = async (req, res) => {
  try {
    let findSubscription = await Subscription.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findSubscription) {
      res.status(409).json({ message: "Subscription already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name,service: req.body.service, type: req.body.type,price: req.body.price,image: fileUrl };
        const subscription = await Subscription.create(data);
        res.status(200).json({ message: "Subscription add successfully.", status: 200, data: subscription });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getsubscription = async (req, res) => {
  try {
    const Subscriptions = await Subscription.find();
    res.status(200).json({ success: true, Subscriptions: Subscriptions });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateSubscription = async (req, res) => {
  const { id } = req.params;
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    res.status(404).json({ message: "Subscription Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    subscription.image = fileUrl || subscription.image;
    subscription.name = req.body.name;
    subscription.service= req.body.service,
    subscription.type= req.body.type,
    subscription.price= req.body.price
    let update = await subscription.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};

exports.removeSubscription = async (req, res) => {
  const { id } = req.params;
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    res.status(404).json({ message: "Subscription Not Found", status: 404, data: {} });
  } else {
    await Subscription.findByIdAndDelete(subscription._id);
    res.status(200).json({ message: "Subscription Deleted Successfully !" });
  }
};