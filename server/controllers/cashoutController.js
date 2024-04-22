const express = require('express');
const CashOutReceipt = require('../modals/cashoutModal');

const postCashOutReceipt = async (req, res) => {
    try {
        const {
            vendorName,
            currentBalance,
            paidAmount,
            remainingAmount,
            billDate,
            paymentType,
            bankName,
            bankPaymentType,
            onlinePaymentGateway,
            chequeNumber,
            comments
        } = req.body;

        const newCashOutReceipt = new CashOutReceipt({
            vendorName,
            currentBalance,
            paidAmount,
            remainingAmount,
            billDate,
            paymentType,
            bankName,
            bankPaymentType,
            onlinePaymentGateway,
            chequeNumber,
            comments
        });

        const savedReceipt = await newCashOutReceipt.save();
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCashOutReceipts = async (req, res) => {
    try {
        const receipts = await CashOutReceipt.find();
        // console.log(receipts);
        res.status(200).json(receipts);
    } catch (error) {
        console.error('Error getting cash out receipts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCashOutReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedReceipt = await CashOutReceipt.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedReceipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json(updatedReceipt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCashOutReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReceipt = await CashOutReceipt.findByIdAndDelete(id);
        if (!deletedReceipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postCashOutReceipt,
    getCashOutReceipts,
    updateCashOutReceipt,
    deleteCashOutReceipt
};
