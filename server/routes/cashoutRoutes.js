const express = require("express");
const router = express.Router();

const { getCashOutReceipts, postCashOutReceipt, updateCashOutReceipt, deleteCashOutReceipt } = require("../controllers/cashoutController");

router.route("/allReceipts").get(getCashOutReceipts);
router.route("/addReceipt").post(postCashOutReceipt);
router.route("/updateReceipt/:id").put(updateCashOutReceipt);
router.route("/deleteReceipt/:id").delete(deleteCashOutReceipt);

module.exports = router;
