const express = require("express");
const router = express.Router();

const { getStudentReceipts, postStudentReceipt, updateStudentReceipt, deleteStudentReceipt } = require("../controllers/studentReceiptController");

router.route("/allReceipts").get(getStudentReceipts);
router.route("/addReceipt").post(postStudentReceipt);
router.route("/updateReceipt/:id").put(updateStudentReceipt);
router.route("/deleteReceipt/:id").delete(deleteStudentReceipt);

module.exports = router;
