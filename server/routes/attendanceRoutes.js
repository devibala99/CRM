const express = require("express");
const router = express.Router();

const { setAttendance, getAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');

router.route("/addAttendance").post(setAttendance);
router.route("/getAttendance").get(getAttendance);
router.route("/updateAttendance/:id").put(updateAttendance);
router.route("/deleteAttendance/:id").delete(deleteAttendance);

module.exports = router;
