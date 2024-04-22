const Interview = require('../modals/interviewModal');
const multer = require('multer');
let path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let filename = '';
        if (req.body.intervieweeName) {
            filename = req.body.intervieweeName.replace(/\s/g, '');
        } else {
            filename = 'candidate_' + Date.now();
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
const upload = multer({ storage, fileFilter, field: 'candidateImage' });
const createInterview = async (req, res) => {
    try {
        const {
            investicatedDate,
            intervieweeName,
            email,
            phoneNumber,
            qualification,
            yearOfPassing,
            location,
            followUpDates, // Array received as a single string
            scheduledDate,
            jobRole,
            source,
        } = req.body;

        // Split the string into an array of values
        const formattedFollowUpDates = followUpDates.split(',');

        // Get the filename of the uploaded image
        const candidateImage = req.file ? `http://localhost:8011/uploads/${req.file.filename}` : null;

        const newInterview = new Interview({
            investicatedDate,
            intervieweeName,
            email,
            phoneNumber,
            qualification,
            yearOfPassing,
            location,
            followUpDates: formattedFollowUpDates, // Use the formatted array
            scheduledDate,
            jobRole,
            source,
            candidateImage,
        });

        const savedInterview = await newInterview.save();
        res.status(201).json(savedInterview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find();
        res.status(200).json(interviews);
    } catch (error) {
        console.error('Error getting interviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getInterviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const interview = await Interview.findById(id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInterview = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedInterview = await Interview.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedInterview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json(updatedInterview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteInterview = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedInterview = await Interview.findByIdAndDelete(id);
        if (!deletedInterview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json({ message: 'Interview deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview,
    upload,
};
