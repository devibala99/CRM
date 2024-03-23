const mongoose = require('mongoose');

const customerReceiptSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
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

const CustomerReceipt = mongoose.model('CustomerReceipt', customerReceiptSchema);

module.exports = CustomerReceipt;
