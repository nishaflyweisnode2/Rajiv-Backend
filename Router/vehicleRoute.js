const express = require("express");
const vehicle = require("../Controller/vehicleController");

const router = express();

router.post("/", [vehicle.addvehicle]);
router.get("/", [vehicle.getvehicle]);
router.put("/:id", [vehicle.updatevehicle]);
router.delete("/:id", [vehicle.Deletevehicle]);

module.exports = router;
