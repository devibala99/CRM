const Employees = require("../modals/employeeModal");
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
            filename = 'employee_' + Date.now();
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
const upload = multer({ storage, fileFilter, field: 'employeeImage' });

const setEmployee = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : '';
        if (!image) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const baseUrl = 'http://localhost:8011/uploads/';
        const url = baseUrl + image
        const newEmployee = await Employees.create({
            employeeId: req.body.employeeId,
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
            designation: req.body.designation,
            salary: req.body.salary,
            annualSalary: req.body.annualSalary,
            doj: req.body.doj,
            dor: req.body.dor,
            aadharNumber: req.body.aadharNumber,
            panNumber: req.body.panNumber,
            bankAccountNumber: req.body.bankAccountNumber,
            employeeImage: url,
            employeeType: req.body.employeeType,
            isStaff: req.body.isStaff,
            staffDoj: req.body.staffDoj,
            comments: req.body.comments,
        });
        // console.log("created");
        res.status(200).json(newEmployee);
    } catch (error) {
        console.log("error created");
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getEmployees = async (req, res) => {
    try {
        const employees = await Employees.find();

        if (!employees || employees.length === 0) {
            return res.status(200).json({ message: 'No Employees found', employees: [] });
        }

        const response = employees.map(employee => ({
            id: employee._id,
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            fatherName: employee.fatherName,
            motherName: employee.motherName,
            dateOfBirth: employee.dateOfBirth,
            emailId: employee.emailId || '',
            address: employee.address,
            contactNumber1: employee.contactNumber1,
            contactNumber2: employee.contactNumber2,
            gender: employee.gender,
            maritalStatus: employee.maritalStatus,
            sslcPercentage: employee.sslcPercentage,
            qualification: employee.qualification,
            hscPercentage: employee.hscPercentage,
            diplomaPercentage: employee.diplomaPercentage,
            ugCollegeName: employee.ugCollegeName,
            ugSpecialization: employee.ugSpecialization,
            ugCgpa: employee.ugCgpa,
            ugYearOfPassing: employee.ugYearOfPassing,
            pgCollegeName: employee.pgCollegeName,
            pgSpecialization: employee.pgSpecialization,
            pgCgpa: employee.pgCgpa,
            pgYearOfPassing: employee.pgYearOfPassing,
            phdCollegeName: employee.phdCollegeName,
            phdSpecialization: employee.phdSpecialization,
            phdCgpa: employee.phdCgpa,
            phdYearOfPassing: employee.phdYearOfPassing,
            workExperience: employee.workExperience,
            designation: employee.designation,
            salary: employee.salary,
            annualSalary: employee.annualSalary,
            doj: employee.doj,
            dor: employee.dor,
            experience: employee.experience,
            aadharNumber: employee.aadharNumber,
            panNumber: employee.panNumber,
            bankAccountNumber: employee.bankAccountNumber,
            employeeImage: employee.employeeImage,
            employeeType: employee.employeeType,
            isStaff: employee.isStaff,
            staffDoj: employee.staffDoj,
            comments: employee.comments,
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting Employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const convertStudentToEmployee = async (req, res) => {
    try {
        const { employeeId, studentData } = req.body;
        delete studentData.studentId;

        studentData.employeeImage = studentData.studentImage;
        // studentData.employeeType = studentData.studentType;
        delete studentData.id;
        delete studentData.__v;
        delete studentData.studentImage;
        delete studentData.studentType;
        delete studentData.course;
        delete studentData.totalAmount;
        delete studentData.paidAmount;
        delete studentData.remainingAmount;

        studentData.employeeId = employeeId;
        const existingEmployee = await Employees.findOne({ emailId: studentData.emailId });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee with the same email already exists' });
        }
        const newEmployee = await Employees.create(studentData);

        // console.log("Employee created successfully:", newEmployee);
        res.status(200).json({ message: 'Employee data received successfully', studentData });
    } catch (error) {
        console.log("Error converting student to employee:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }
        const updateFields = {
            employeeId: req.body.employeeId,
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
            designation: req.body.designation,
            salary: req.body.salary,
            annualSalary: req.body.annualSalary,
            doj: req.body.doj,
            dor: req.body.dor,
            aadharNumber: req.body.aadharNumber,
            panNumber: req.body.panNumber,
            bankAccountNumber: req.body.bankAccountNumber,
            employeeType: req.body.employeeType,
            isStaff: req.body.isStaff,
            staffDoj: req.body.staffDoj,
            comments: req.body.comments,
        };
        const additionalFields = {};
        if (req.file) {
            const imageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;
            additionalFields.employeeImage = imageUrl;
        }

        const mergedFields = { ...updateFields, ...additionalFields };

        const updatedEmployee = await Employees.findByIdAndUpdate(id, mergedFields, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // console.log(updatedEmployee);
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        const deletedEmployee = await Employees.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    setEmployee, getEmployees, upload, updateEmployee, deleteEmployee, convertStudentToEmployee
}