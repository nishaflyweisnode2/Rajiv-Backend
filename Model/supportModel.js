const mongoose = require("mongoose"); 

const supportSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    contact: {
        type: String
    }
})



const support  = mongoose.model('support', supportSchema);

module.exports = support