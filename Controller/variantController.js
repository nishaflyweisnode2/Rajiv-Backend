const variant = require("../Model/variantModel");

exports.addvariant = async (req, res) => {
  try {
    const variantData = await variant.create({ name: req.body.name ,vehicle:req.body.vehicle});
    res.status(200).json({
      data: variantData,
      message: "  variant Added ",
      details: variantData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.getvariant = async (req, res) => {
  try {
    const data = await variant.find().populate("vehicle");
    // console.log(data);
    res.status(200).json({
        variant: data,
    });
  } catch (err) {
    res.status(400).send({ mesage: err.mesage });
  }
};

exports.updateVariant = async (req, res) => {
    try {
      const updatedVariant = await variant
        .findOneAndUpdate(
          { _id: req.params.id },
          {
            name: req.body.name,
            vehicle: req.body.vehicle
          }
        )
        .exec();
      console.log(updatedVariant);
      res.status(200).json({
        message: "Variant updated",
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: err.message,  // Fix the typo here from err.mesage to err.message
      });
    }
  };
  
exports.Deletevariant= async (req, res) => {
  try {
    const id = req.params.id;
    await variant.deleteOne({ _id: id });
    res.status(200).send({ message: "variant deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.getVariantsByVehicleId = async (req, res) => {
    try {
      const vehicleId = req.params.vehicleId; // Assuming the parameter is named vehicleId
  
      const variants = await variant.find({ vehicle: vehicleId }).exec();
  
      if (!variants || variants.length === 0) {
        return res.status(404).json({
          message: "No variants found for the specified vehicle ID",
        });
      }
  
      res.status(200).json({
        message: "Variants retrieved successfully",
        variants: variants,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  