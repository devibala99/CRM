const express = require("express");
const router = express.Router();

const { getStudents, setStudents, upload, updateStudent, deleteStudent } = require("../controllers/studentController");

router.route("/allStudents").get(getStudents);
router.route("/addStudent").post(upload.single('studentImage'),
    setStudents);
router.route("/updateStudent/:id").put(upload.single('studentImage'), updateStudent);
router.route("/deleteStudent/:id").delete(deleteStudent);

module.exports = router;