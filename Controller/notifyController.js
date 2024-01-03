const notify= require('../Model/notifyModel');

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
exports.AddNotification = async(req,res) => {
try {
    let findnotify = await notify.findOne({ message: req.body.message });
    console.log(req.body.name)
    if (findnotify) {
      res.status(409).json({ message: "notify already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { message: req.body.message, desc: req.body.desc, image: fileUrl };
        const notifys = await notify.create(data);
        res.status(200).json({ message: "notify add successfully.", status: 200, data: notifys });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};
exports.GetAllNotification = async(req,res) => {
    try{
    const data = await notify.find();
    res.status(200).json({
        message: data,
        total: data.length
    })
    }catch(err){
       res.status(400).json({
        message: err.message
       })
    }
}
exports.GetBYNotifyID = async(req,res) => {
    try{
    const data = await notify.findById({_id: req.params.id})
    res.status(200).json({
        message: data
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.deleteNotification = async(req,res) => {
    try{
    await notify.findByIdAndDelete({_id: req.params.id});
    res.status(200).json({
        message: "Notification Deleted "
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}
