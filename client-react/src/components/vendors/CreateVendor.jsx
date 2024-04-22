import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createVendorDetail } from '../features/vendorDetailsSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';

const CreateVendor = () => {
    const [vendorDetail, setVendorDetail] = useState({
        vendorName: "",
        vendorType: "",
        mobileNumber: "",
        emailId: "",
        address: "",
        currentBalance: "",
        paidAmount: [],
        remainingAmount: "",
        comments: "",
    });

    const dispatch = useDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedDetails = { ...vendorDetail, [name]: value };

        if (name === "paidAmount") {
            const currentBalance = parseFloat(updatedDetails.currentBalance || 0.00);
            const paidAmount = parseFloat(updatedDetails.paidAmount || 0.00);
            updatedDetails.remainingAmount = currentBalance - paidAmount;
        }
        setVendorDetail(updatedDetails);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
    };
    const handlePaidAmountChange = (e) => {
        const { value } = e.target;
        const paidAmount = parseFloat(value);
        if (paidAmount > vendorDetail.currentBalance) {
            setVendorDetail(prevState => ({
                ...prevState,
                paidAmount: 0.00
            }));
        }
        else {
            handleInputChange(e);
        }
    }
    const handleVendorSubmit = async (e) => {
        e.preventDefault();
        try {
            const action = await dispatch(createVendorDetail(vendorDetail));
            const response = action.payload;

            if (action.type === 'vendorDetails/createVendorDetail/fulfilled' && response) {
                setSuccessMessage(true);
                setSnackbarOpen(true);
                // Check if paidAmount is empty
                const remainingAmountValue = vendorDetail.paidAmount ? vendorDetail.paidAmount : vendorDetail.currentBalance;
                setVendorDetail({
                    vendorName: "",
                    vendorType: "",
                    mobileNumber: "",
                    emailId: "",
                    address: "",
                    currentBalance: "",
                    paidAmount: [],
                    remainingAmount: remainingAmountValue,
                    comments: "",
                });
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Error occurred while creating the vendor.");
            setErrorSnackbarOpen(true);
        }
    };


    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/vendors" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Vendors
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Register Vendors</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            {successMessage && (<Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Successfully created vendor!
                </MuiAlert>

            </Snackbar>
            )}
            {errorMessage && (
                <Snackbar
                    open={errorSnackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseErrorSnackbar}
                >
                    <MuiAlert
                        onClose={handleCloseSnackbar}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </MuiAlert>
                </Snackbar>
            )}
            <div className="add-employee_container">
                <form onSubmit={handleVendorSubmit} className='employeeForm'>
                    <div className="form-group">
                        <label htmlFor="vendorName">Vendor Name:</label>
                        <input
                            type="text"
                            id="vendorName"
                            name="vendorName"
                            value={vendorDetail.vendorName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="vendorType">Vendor Type:</label>
                        <input
                            type="text"
                            id="vendorType"
                            name="vendorType"
                            value={vendorDetail.vendorType}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobileNumber">Mobile Number:</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={vendorDetail.mobileNumber}
                            onChange={handleInputChange}
                            maxLength={10} minLength={10}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailId">Email ID:</label>
                        <input
                            type="text"
                            id="emailId"
                            name="emailId"
                            value={vendorDetail.emailId}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <textarea
                            type="text"
                            id="address"
                            name="address"
                            value={vendorDetail.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="currentBalance">Current Balance:</label>
                        <input
                            type="text"
                            id="currentBalance"
                            name="currentBalance"
                            value={vendorDetail.currentBalance}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paidAmount">Paid Amount:</label>
                        <input
                            type="text"
                            id="paidAmount"
                            name="paidAmount"
                            max={vendorDetail.currentBalance}
                            value={vendorDetail.paidAmount}
                            onChange={handlePaidAmountChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="remainingAmount">Remaining Amount:</label>
                        <input
                            type="text"
                            id="remainingAmount"
                            name="remainingAmount"
                            value={vendorDetail.remainingAmount}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Comments:</label>
                        <textarea
                            type="text"
                            id="comments"
                            name="comments"
                            value={vendorDetail.comments}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="full-width">
                        <div className="btn-submit">
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVendor;
