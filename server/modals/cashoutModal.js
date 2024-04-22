const mongoose = require('mongoose');

const cashOutSchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    currentBalance: { type: String, required: true },
    paidAmount: { type: String, required: true },
    remainingAmount: { type: String, required: true },
    billDate: { type: String, required: true },
    paymentType: { type: String, required: true },
    bankName: { type: String },
    bankPaymentType: { type: String },
    onlinePaymentGateway: { type: String },
    chequeNumber: { type: String },
    comments: { type: String }
});

const cashoutReceipt = mongoose.model('CashOut', cashOutSchema);

module.exports = cashoutReceipt;
