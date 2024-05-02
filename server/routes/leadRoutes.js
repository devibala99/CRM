const express = require("express");
const router = express.Router();

const { getAllLeads, createLead, updateLead, deleteLead } = require("../controllers/leadController");

router.route("/allLeads").get(getAllLeads);
router.route("/addLead").post(createLead);
router.route("/updateLead/:id").put(updateLead);
router.route("/deleteLead/:id").delete(deleteLead);

module.exports = router;
