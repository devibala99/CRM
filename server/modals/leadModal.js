const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadName: {
        type: String,
        required: true
    },
    leadCreatedOn: {
        type: Date,
        required: true
    },
    leadEmail: {
        type: String,
        required: true
    },
    leadPhoneNumber: {
        type: String,
        required: true
    },
    leadType: {
        type: String,
        required: true
    },
    leadCompany: {
        type: String,
        // required: true
    },
    leadQualification: {
        type: String,
        required: true
    },
    leadJobTitle: {
        type: String,
    },
    industry: {
        type: String,
    },
    locationRegion: {
        type: String
    },
    address: {
        type: String
    },
    commands: {
        type: String,
    },
    followUpdate: {
        type: [String],
    },
    leadStatus: {
        type: [String],
        default: ['New']
    },
    leadSource: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
    }
});
leadSchema.pre('save', function (next) {
    this.tags = [this.leadStatus, this.followUpdate, this.leadSource].flat();
    next();
});
const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
