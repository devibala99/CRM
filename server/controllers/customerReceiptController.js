const express = require('express');
const CustomerReceipt = require('../modals/customerReceiptModal');

const postCustomerReceipt = async (req, res) => {
    try {
        const {
            customerName,
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

        const newCustomerReceipt = new CustomerReceipt({
            customerName,
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

        const savedReceipt = await newCustomerReceipt.save();
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCustomerReceipts = async (req, res) => {
    try {
        const receipts = await CustomerReceipt.find();
        res.status(200).json(receipts);
    } catch (error) {
        console.error('Error getting customer receipts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCustomerReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedReceipt = await CustomerReceipt.findByIdAndUpdate(
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

const deleteCustomerReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReceipt = await CustomerReceipt.findByIdAndDelete(id);
        if (!deletedReceipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postCustomerReceipt,
    getCustomerReceipts,
    updateCustomerReceipt,
    deleteCustomerReceipt
};
