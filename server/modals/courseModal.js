// Import the required modules
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    courseFees: {
        type: String,
        required: true
    },
    duration: {
        type: String,
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
