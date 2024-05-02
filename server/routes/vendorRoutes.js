const express = require("express");
const router = express.Router();

const { getVendorDetails, postVendorDetail, updateVendorDetail, deleteVendorDetail } = require("../controllers/vendorsController");

router.route("/allVendors").get(getVendorDetails);
router.route("/addVendor").post(postVendorDetail);
router.route("/updateVendor/:id").put(updateVendorDetail);
router.route("/deleteVendor/:id").delete(deleteVendorDetail);

module.exports = router;
