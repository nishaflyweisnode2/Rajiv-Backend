const mongoose = require("mongoose"); 

const reasonSchema = mongoose.Schema({
    reason: {
        type: String
    }
})



const terms  = mongoose.model('reason', reasonSchema);

module.exports = terms