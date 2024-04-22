const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    vendorType: { type: String, required: true },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    emailId: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    address: { type: String, required: true },
    currentBalance: { type: String, required: true },
    paidAmount: [String],
    remainingAmount: { type: String },
    comments: { type: String },
})

const VendorDetail = mongoose.model("VendorDetails", vendorSchema);

module.exports = VendorDetail;
