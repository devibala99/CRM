const express = require("express");
const router = express.Router();

const { getEmployees, setEmployee, upload, updateEmployee, deleteEmployee, convertStudentToEmployee } = require("../controllers/employeeController");

router.route("/allEmployees").get(getEmployees);
router.route("/addEmployee").post(upload.single('employeeImage'), setEmployee);
router.route("/updateEmployee/:id").put(upload.single('employeeImage'), updateEmployee);
router.route("/deleteEmployee/:id").delete(deleteEmployee);
router.route("/convertToEmployee").post(convertStudentToEmployee);

module.exports = router;