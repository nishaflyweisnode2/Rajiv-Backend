const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Service Required"],
    },
    image: {
        type: String
    },
    
});

module.exports = mongoose.model("Service",serviceSchema);