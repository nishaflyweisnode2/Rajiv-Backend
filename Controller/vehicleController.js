const vehicle = require("../Model/vehicleModel");

exports.addvehicle = async (req, res) => {
  try {
    const vehicleData = await vehicle.create({ name: req.body.name });
    res.status(200).json({
      data: vehicleData,
      message: "  vehicle Added ",
      details: vehicleData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};

exports.getvehicle = async (req, res) => {
  try {
    const data = await vehicle.find();
    // console.log(data);
    res.status(200).json({
      vehicle: data,
    });
  } catch (err) {
    res.status(400).send({ mesage: err.mesage });
  }
};

exports.updatevehicle = async (req, res) => {
  try {
    const Updatedvehicle = await vehicle
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
        }
      )
      .exec();
    console.log(Updatedvehicle);
    res.status(200).json({
      message: "vehicle Update",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      mesage: err.mesage,
    });
  }
};

exports.Deletevehicle = async (req, res) => {
  try {
    const id = req.params.id;
    await vehicle.deleteOne({ _id: id });
    res.status(200).send({ message: "vehicle deleted " });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
};
