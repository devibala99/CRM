const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    DateCol: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Qualification: {
        type: String
    },
    YearOfPassing: {
        type: String
    },
    PhoneNumber: {
        type: String
    },
    FollowUpdates: {
        type: String
    },
    Source: {
        type: String
    }
}, { strict: false, timestamps: true });

module.exports = mongoose.model('ExcelLead', leadSchema);
