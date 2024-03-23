const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffName: {
        type: String,
        required: true
    },
    staffDoj: {
        type: Date,
        required: true
    },
    comments: {
        type: String
    }
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
