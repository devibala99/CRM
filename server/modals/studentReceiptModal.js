const mongoose = require('mongoose');

const studentReceiptSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    currentBalance: { type: String, required: true },
    paidAmount: { type: String, required: true },
    remainingAmount: { type: String, required: true },
    billDate: { type: String, required: true },
    paymentType: { type: String, required: true },
    bankName: { type: String },
    bankPaymentType: { type: String },
    onlinePaymentGateway: { type: String },
    chequeNumber: { type: String },
    course: { type: String },
    duration: { type: String },
    comments: { type: String }
});

const StudentReceipt = mongoose.model('StudentReceipt', studentReceiptSchema);

module.exports = StudentReceipt;
