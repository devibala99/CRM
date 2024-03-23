const express = require("express");
const router = express.Router();

const { getCustomerReceipts, postCustomerReceipt, updateCustomerReceipt, deleteCustomerReceipt } = require("../controllers/customerReceiptController");

router.route("/allReceipts").get(getCustomerReceipts);
router.route("/addReceipt").post(postCustomerReceipt);
router.route("/updateReceipt/:id").put(updateCustomerReceipt);
router.route("/deleteReceipt/:id").delete(deleteCustomerReceipt);

module.exports = router;
