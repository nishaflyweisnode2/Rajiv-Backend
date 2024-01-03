const express = require("express");
const variant = require("../Controller/variantController");

const router = express();

router.post("/", [variant.addvariant]);
router.get("/", [variant.getvariant]);
router.get("/get/:vehicleId", [variant.getVariantsByVehicleId]);

router.put("/:id", [variant.updateVariant]);
router.delete("/:id", [variant.Deletevariant]);

module.exports = router;
