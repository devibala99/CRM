const express = require("express");
const router = express.Router();

const { getAllStaff, createStaff, updateStaff, deleteStaff } = require("../controllers/staffController");

router.route("/allStaff").get(getAllStaff);
router.route("/addStaff").post(createStaff);
router.route("/updateStaff/:id").put(updateStaff);
router.route("/deleteStaff/:id").delete(deleteStaff);

module.exports = router;
