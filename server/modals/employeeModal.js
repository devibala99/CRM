const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
    employeeId: {
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
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,

    },
    address: {
        type: String,
        required: true
    },
    contactNumber1: {
        type: String,
        required: true
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
    designation: {
        type: String,
    },

    salary: {
        type: String,
    },

    annualSalary: {
        type: String,
    },

    doj: {
        type: String,
    },
    dor: {
        type: String,

    },
    aadharNumber: {
        type: String,
    },
    panNumber: {
        type: String,
    },
    bankAccountNumber: {
        type: String,
    },
    employeeType: {
        type: String,
    },
    isStaff: {
        type: String,
    },
    staffDoj: {
        type: String,
    },
    comments: {
        type: String,
    },
    employeeImage: {
        type: String

    }
});

module.exports = mongoose.model('Employee', employeeSchema);
