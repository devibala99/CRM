const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    clientName: {
        type: String,
    },
    address: {
        type: String,
    },
    date: {
        type: String,
    },
    state: {
        type: String,
    },
    inVoice_no: {
        type: String,
        unique: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    gst_in: {
        type: String,
    }
});

module.exports = mongoose.model('Client', clientSchema);