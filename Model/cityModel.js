const mongoose = require("mongoose"); 

const citySchema = mongoose.Schema({
    city: {
        type: String
    }
})



const city  = mongoose.model('city', citySchema);

module.exports = city