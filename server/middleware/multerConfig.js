// multerConfig.js

const multer = require('multer');

// Set up multer storage
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage: storage });

// Specify the allowed file types and sizes if needed
const fileFilter = (req, file, cb) => {
    // Check file types, for example, allow only jpeg and png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, "D:\\kitkat-hrm\\server\\uploads");
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
};

// Configure multer with the storage and fileFilter
const multerConfig = upload.single('studentImage');

module.exports = multerConfig;
