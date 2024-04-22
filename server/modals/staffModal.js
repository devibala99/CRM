const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffName: {
        type: String,
        // required: true
    },
    staffDoj: {
        type: Date,
        // required: true
    },
    comments: {
        type: String
    },
    userName: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true,
    }
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
