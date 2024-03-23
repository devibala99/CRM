const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
    clientName: {
        type: String,
    },
    address: {
        type: String,
    },
    date: {
        type: String,
    },
    inVoice_no: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    gst_in: {
        type: String,
    },
    productDetails: [
        {
            sno: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: Number,
                required: true
            },
            totalAmount: {
                type: Number,
                required: true
            }
        }
    ],
    cgstAmount: {
        type: Number,
    },
    sgstAmount: {
        type: Number,
    },
    igstAmount: {
        type: Number,
    },
    finalTotal: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    remainingAmount: {
        type: Number
    }

});

module.exports = mongoose.model("Invoice", invoiceSchema);