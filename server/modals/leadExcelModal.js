const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    Date: {
        type: Date,
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
        type: Number
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
});

const LeadExcel = mongoose.model('LeadExcel', leadSchema);

module.exports = LeadExcel;
