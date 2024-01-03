const express = require("express");
const notify = require("../Controller/notifyController");

const router = express();

router.post("/", notify.AddNotification);
router.get("/", notify.GetAllNotification);

router.get("/get/:id", notify.GetBYNotifyID);
router.delete("/delete/:id", notify.deleteNotification);

module.exports = router;
