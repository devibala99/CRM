const express = require('express');
const router = express.Router();
const {
    createInterview,
    getInterviews,
    upload,
    updateInterview,
    deleteInterview
} = require('../controllers/interviewController');

// router.post('/create-interview', createInterview);
router.get('/fetch-interviews', getInterviews);
// router.get('/interviews/:id', getInterviewById);
router.put('/update-interview/:id', updateInterview);
router.delete('/delete-interview/:id', deleteInterview);
router.post('/create-interview', upload.single('candidateImage'), createInterview);

module.exports = router;
