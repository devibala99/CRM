const Students = require("../modals/studentModal");
const mongoose = require('mongoose');

const multer = require('multer');

let path = require('path');

// const storage = multer.memoryStorage(); // Use memory storage to handle files as buffers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let filename = '';
        if (req.body.firstName && req.body.fatherName && req.body.firstName.trim() && req.body.fatherName.trim()) {
            filename = req.body.firstName.replace(/\s/g, '') + req.body.fatherName.replace(/\s/g, '');
        } else {
            filename = 'student_' + Date.now();
        }

        filename += '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
// Create a middleware for uploading images
const upload = multer({ storage, fileFilter, field: 'studentImage' });

const setStudents = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : '';
        if (!image) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        const totalAmount = parseFloat(req.body.totalAmount);
        if (isNaN(totalAmount)) {
            return res.status(400).json({ error: 'Invalid totalAmount value' });
        }

        const baseUrl = 'http://localhost:8011/uploads/';
        const url = baseUrl + image
        const newStudent = await Students.create({
            studentId: req.body.studentId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            dateOfBirth: req.body.dateOfBirth,
            emailId: req.body.emailId || '',
            address: req.body.address,
            contactNumber1: req.body.contactNumber1,
            contactNumber2: req.body.contactNumber2,
            gender: req.body.gender,
            maritalStatus: req.body.maritalStatus,
            sslcPercentage: req.body.sslcPercentage,
            qualification: req.body.qualification,
            hscPercentage: req.body.hscPercentage,
            diplomaPercentage: req.body.diplomaPercentage,
            ugCollegeName: req.body.ugCollegeName,
            ugSpecialization: req.body.ugSpecialization,
            ugCgpa: req.body.ugCgpa,
            ugYearOfPassing: req.body.ugYearOfPassing,
            pgCollegeName: req.body.pgCollegeName,
            pgSpecialization: req.body.pgSpecialization,
            pgCgpa: req.body.pgCgpa,
            pgYearOfPassing: req.body.pgYearOfPassing,
            phdCollegeName: req.body.phdCollegeName,
            phdSpecialization: req.body.phdSpecialization,
            phdCgpa: req.body.phdCgpa,
            phdYearOfPassing: req.body.phdYearOfPassing,
            workExperience: req.body.workExperience,
            course: req.body.course,
            totalAmount: totalAmount,
            paidAmount: req.body.paidAmount,
            remainingAmount: req.body.remainingAmount,
            doj: req.body.doj,
            mentor: req.body.mentor,
            studentImage: url,
            studentStatus: req.body.studentStatus,
            comments: req.body.comments,
        });
        // console.log("created--", newStudent);
        res.status(200).json(newStudent);
    } catch (error) {
        console.error("error created---", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getStudents = async (req, res) => {
    try {
        const students = await Students.find();

        if (!students || students.length === 0) {
            return res.status(200).json({ message: 'No students found', students: [] });
        }
        const response = students.map(students => ({
            id: students._id,
            studentId: students.studentId,
            firstName: students.firstName,
            lastName: students.lastName,
            fatherName: students.fatherName,
            motherName: students.motherName,
            dateOfBirth: students.dateOfBirth,
            emailId: students.emailId,
            address: students.address,
            contactNumber1: students.contactNumber1,
            contactNumber2: students.contactNumber2,
            gender: students.gender,
            maritalStatus: students.maritalStatus,
            sslcPercentage: students.sslcPercentage,
            qualification: students.qualification,
            hscPercentage: students.hscPercentage,
            diplomaPercentage: students.diplomaPercentage,
            ugCollegeName: students.ugCollegeName,
            ugSpecialization: students.ugSpecialization,
            ugCgpa: students.ugCgpa,
            ugYearOfPassing: students.ugYearOfPassing,
            pgCollegeName: students.pgCollegeName,
            pgSpecialization: students.pgSpecialization,
            pgCgpa: students.pgCgpa,
            pgYearOfPassing: students.pgYearOfPassing,
            phdCollegeName: students.phdCollegeName,
            phdSpecialization: students.phdSpecialization,
            phdCgpa: students.phdCgpa,
            phdYearOfPassing: students.phdYearOfPassing,
            workExperience: students.workExperience,
            course: students.course,
            totalAmount: students.totalAmount,
            paidAmount: students.paidAmount,
            remainingAmount: students.remainingAmount,
            doj: students.doj,
            studentImage: students.studentImage,
            mentor: students.mentor,
            studentStatus: students.studentStatus,
            comments: students.comments,
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateStudent = async (req, res) => {

    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }
        const updateFields = {
            studentId: req.body.studentId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            dateOfBirth: req.body.dateOfBirth,
            emailId: req.body.emailId,
            address: req.body.address,
            contactNumber1: req.body.contactNumber1,
            contactNumber2: req.body.contactNumber2,
            gender: req.body.gender,
            maritalStatus: req.body.maritalStatus,
            sslcPercentage: req.body.sslcPercentage,
            qualification: req.body.qualification,
            hscPercentage: req.body.hscPercentage,
            diplomaPercentage: req.body.diplomaPercentage,
            ugCollegeName: req.body.ugCollegeName,
            ugSpecialization: req.body.ugSpecialization,
            ugCgpa: req.body.ugCgpa,
            ugYearOfPassing: req.body.ugYearOfPassing,
            pgCollegeName: req.body.pgCollegeName,
            pgSpecialization: req.body.pgSpecialization,
            pgCgpa: req.body.pgCgpa,
            pgYearOfPassing: req.body.pgYearOfPassing,
            phdCollegeName: req.body.phdCollegeName,
            phdSpecialization: req.body.phdSpecialization,
            phdCgpa: req.body.phdCgpa,
            phdYearOfPassing: req.body.phdYearOfPassing,
            workExperience: req.body.workExperience,
            course: req.body.course,
            totalAmount: req.body.totalAmount,
            paidAmount: req.body.paidAmount,
            remainingAmount: req.body.remainingAmount,
            doj: req.body.doj,
            mentor: req.body.mentor,
            studentStatus: req.body.studentStatus,
            comments: req.body.comments,
        };

        if (req.file) {
            const imageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;
            updateFields.studentImage = imageUrl;
        }

        const updatedStudent = await Students.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // console.log(updatedStudent);
        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Students.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    setStudents, getStudents, upload, updateStudent, deleteStudent
}