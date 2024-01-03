const mongoose = require("mongoose"); 

const privacySchema = mongoose.Schema({
    privacy: {
        type: String
    },
    type: {
        type: String,
        enum: ['vendor','user', 'driver'], // Add your allowed types here
      },
})



const privacy  = mongoose.model('privacy', privacySchema);

module.exports = privacy