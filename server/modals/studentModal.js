const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: true

    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber1: {
        type: String,
        required: true,
        unique: true
    },
    contactNumber2: {
        type: String,
    },
    gender: {
        type: String,
        required: true

    },
    maritalStatus: {
        type: String,
        required: true

    },
    sslcPercentage: {
        type: String,
        required: true

    },
    qualification: {
        type: String,
    },
    hscPercentage: {
        type: String,
    },
    diplomaPercentage: {
        type: String,
    },
    ugCollegeName: {
        type: String,
    },
    ugSpecialization: {
        type: String,
    },
    ugCgpa: {
        type: String,
    },
    ugYearOfPassing: {
        type: String,
    },
    pgCollegeName: {
        type: String,
    },
    pgSpecialization: {
        type: String,
    },
    pgCgpa: {
        type: String,
    },
    pgYearOfPassing: {
        type: String,
    },
    phdCollegeName: {
        type: String,
    },
    phdSpecialization: {
        type: String,
    },
    phdCgpa: {
        type: String,
    },
    phdYearOfPassing: {
        type: String,
    },
    workExperience: {
        type: String,
    },
    course: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    paidAmount: {
        type: Number,
    },
    doj: {
        type: String,
    },
    remainingAmount: {
        type: Number,
    },
    mentor: {
        type: String,
    },
    studentStatus: {
        type: String,
    },
    studentImage: {
        type: String,
    },
    comments: {
        type: String,
    }
});


module.exports = mongoose.model('Students', studentSchema);

