const express = require('express');
const StudentReceipt = require('../modals/studentReceiptModal');

const postStudentReceipt = async (req, res) => {
    try {
        const {
            studentName,
            currentBalance,
            paidAmount,
            remainingAmount,
            billDate,
            paymentType,
            bankName,
            bankPaymentType,
            onlinePaymentGateway,
            chequeNumber,
            course,
            duration,
            comments
        } = req.body;

        const newStudentReceipt = new StudentReceipt({
            studentName,
            currentBalance,
            paidAmount,
            remainingAmount,
            billDate,
            paymentType,
            bankName,
            bankPaymentType,
            onlinePaymentGateway,
            chequeNumber,
            course,
            duration,
            comments
        });

        const savedReceipt = await newStudentReceipt.save();
        // console.log(savedReceipt, "receipt");
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getStudentReceipts = async (req, res) => {
    try {
        const receipts = await StudentReceipt.find();
        // console.log(receipts);
        res.status(200).json(receipts);
    } catch (error) {
        console.error('Error getting student receipts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateStudentReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedReceipt = await StudentReceipt.findByIdAndUpdate(
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

const deleteStudentReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedReceipt = await StudentReceipt.findByIdAndDelete(id);
        if (!deletedReceipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postStudentReceipt,
    getStudentReceipts,
    updateStudentReceipt,
    deleteStudentReceipt
};
