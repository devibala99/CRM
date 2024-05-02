const express = require("express");
const router = express.Router();

const { postLeadDetail, getLeadDetails, updateLeadDetail, deleteLeadDetail } = require("../controllers/leadExcelController");

router.route("/addLead").post(postLeadDetail);
router.route("/allLeads").get(getLeadDetails);
router.route("/updateLead/:id").put(updateLeadDetail);
router.route("/deleteLead/:id").delete(deleteLeadDetail);

module.exports = router;
