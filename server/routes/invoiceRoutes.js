const express = require("express");
const router = express.Router();

const { getInvoice, postInvoice, updateInvoice, deleteInvoice } = require("../controllers/invoiceController");

router.route("/allInvoices").get(getInvoice);
router.route("/addInvoice").post(postInvoice);
router.route("/updateInvoice/:id").put(updateInvoice);
router.route("/deleteInvoice/:id").delete(deleteInvoice);
module.exports = router;