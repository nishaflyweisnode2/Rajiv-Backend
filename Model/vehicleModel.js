const mongoose = require("mongoose"); 

const vehicleSchema = mongoose.Schema({
    name: {
        type: String
    }
})



const vehicle  = mongoose.model('vehicle', vehicleSchema);

module.exports = vehicle