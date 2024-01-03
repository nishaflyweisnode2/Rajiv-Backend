const Service= require('../Model/serviceModel')
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
exports.AddService = async (req, res) => {
  try {
    let findService = await Service.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findService) {
      res.status(409).json({ message: "Service already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const service = await Service.create(data);
        res.status(200).json({ message: "Service add successfully.", status: 200, data: service });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getService = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, services: services });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    res.status(404).json({ message: "Service Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    service.image = fileUrl || service.image;
    service.name = req.body.name;
    let update = await service.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};

exports.removeService = async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    res.status(404).json({ message: "Service Not Found", status: 404, data: {} });
  } else {
    await Service.findByIdAndDelete(service._id);
    res.status(200).json({ message: "Service Deleted Successfully !" });
  }
};