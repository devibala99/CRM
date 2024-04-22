const express = require('express');
const Invoice = require('../modals/invoiceModal');

const postInvoice = async (req, res) => {
    try {
        const {
            clientName,
            address,
            date,
            inVoice_no,
            phoneNumber = [],
            gst_in,
            productDetails,
            cgstAmount,
            sgstAmount,
            igstAmount,
            finalTotal,
            subTotal,
        } = req.body;
        const remainingAmount = finalTotal;
        let existingInvoice = await Invoice.findOne({ inVoice_no });

        if (existingInvoice) {
            existingInvoice.clientName = clientName;
            existingInvoice.address = address;
            existingInvoice.date = date;
            existingInvoice.phoneNumber = phoneNumber;
            existingInvoice.gst_in = gst_in;
            existingInvoice.productDetails = productDetails;
            existingInvoice.cgstAmount = cgstAmount;
            existingInvoice.sgstAmount = sgstAmount;
            existingInvoice.igstAmount = igstAmount;
            existingInvoice.finalTotal = finalTotal;
            existingInvoice.subTotal = subTotal;
            existingInvoice.remainingAmount = remainingAmount;
            const updatedInvoice = await existingInvoice.save();
            res.status(200).json(updatedInvoice);
        } else {
            const newInvoice = new Invoice({
                clientName,
                address,
                date,
                inVoice_no,
                phoneNumber,
                gst_in,
                productDetails,
                cgstAmount,
                sgstAmount,
                igstAmount,
                finalTotal,
                subTotal,
                remainingAmount,
            });

            const savedInvoice = await newInvoice.save();
            res.status(201).json(savedInvoice);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        if (!invoices || invoices.length === 0) {
            return res.status(200).json({ message: "No Invoices Found", invoices: [] });
        }
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error getting invoices:', error);
        res.status(500).json({ message: 'Error getting invoices', error: error.message });
    }
};


const updateInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInvoice,
    postInvoice,
    updateInvoice,
    deleteInvoice
};
