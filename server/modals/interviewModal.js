const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    investicatedDate: { type: String, required: true },
    intervieweeName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    qualification: { type: String, required: true },
    yearOfPassing: { type: String, required: true },
    location: { type: String, required: true },
    followUpDates: { type: [String], default: [] },
    scheduledDate: { type: String, required: true },
    jobRole: { type: String, required: true },
    source: { type: String, required: true },
    candidateImage: { type: String },
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
