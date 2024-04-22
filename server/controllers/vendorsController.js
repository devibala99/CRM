const express = require('express');
const VendorDetail = require('../modals/vendorModal');

const postVendorDetail = async (req, res) => {
    try {
        const {
            vendorName,
            vendorType,
            mobileNumber,
            emailId,
            address,
            currentBalance,
            paidAmount,
            remainingAmount,
            comments
        } = req.body;

        const newVendorDetail = new VendorDetail({
            vendorName,
            vendorType,
            mobileNumber,
            emailId,
            address,
            currentBalance,
            paidAmount,
            remainingAmount,
            comments
        });

        const savedVendorDetail = await newVendorDetail.save();
        res.status(201).json(savedVendorDetail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getVendorDetails = async (req, res) => {
    try {
        const vendors = await VendorDetail.find();

        if (!vendors || vendors.length === 0) {
            return res.status(200).json({ message: 'No vendors found', vendors: [] });
        }

        const response = vendors.map(vendor => ({
            id: vendor._id,
            vendorName: vendor.vendorName,
            vendorType: vendor.vendorType,
            mobileNumber: vendor.mobileNumber,
            emailId: vendor.emailId || '',
            address: vendor.address,
            currentBalance: vendor.currentBalance,
            paidAmount: vendor.paidAmount,
            remainingAmount: vendor.remainingAmount,
            comments: vendor.comments,
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting vendor details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateVendorDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedVendorDetail = await VendorDetail.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedVendorDetail) {
            return res.status(404).json({ message: 'Vendor detail not found' });
        }
        res.status(200).json(updatedVendorDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVendorDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedVendorDetail = await VendorDetail.findByIdAndDelete(id);
        if (!deletedVendorDetail) {
            return res.status(404).json({ message: 'Vendor detail not found' });
        }
        res.status(200).json({ message: 'Vendor detail deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postVendorDetail,
    getVendorDetails,
    updateVendorDetail,
    deleteVendorDetail
};
