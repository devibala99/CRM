const express = require("express");
const router = express.Router();

const { fetchCourse, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController");

router.route("/allCourses").get(fetchCourse);
router.route("/createCourse").post(createCourse);
router.route("/updateCourse/:id").put(updateCourse);
router.route("/deleteCourse/:id").delete(deleteCourse);

module.exports = router;