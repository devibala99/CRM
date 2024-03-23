import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCashoutReceipt } from '../features/cashoutReceiptsSlice';
import { getVendorDetails, updateVendorDetail } from "../features/vendorDetailsSlice";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { bankNames } from "./bankNames";
import { paymentPlatforms } from "./paymentPlatforms";

const CreateCashout = () => {
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [cashoutReceipt, setCashoutReceipt] = useState({
        vendorName: "",
        currentBalance: "",
        paidAmount: "",
        remainingAmount: "",
        billDate: "",
        paymentType: "",
        bankName: "",
        bankPaymentType: "",
        onlinePaymentGateway: "",
        chequeNumber: "",
        comments: "",
    });
    const dispatch = useDispatch();
    const vendors = useSelector(state => state.vendorDetails.vendorDetailEntries);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        dispatch(getVendorDetails());
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem("vendorList", JSON.stringify(vendors));
    }, [vendors]);

    const handlePaidAmountChange = (e) => {
        const { value } = e.target;
        const paidAmount = parseFloat(value);
        if (paidAmount > cashoutReceipt.currentBalance) {
            setCashoutReceipt(prevState => ({
                ...prevState,
                paidAmount: 0.00,
            }));
        }
        else {
            handleInputChange(e);
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedDetails = { ...cashoutReceipt, [name]: value };

        if (name === "currentBalance" || name === "paidAmount") {
            const currentBalance = parseFloat(updatedDetails.currentBalance || 0.00);
            const paidAmount = parseFloat(updatedDetails.paidAmount || 0.00);
            updatedDetails.remainingAmount = currentBalance - paidAmount;
        }

        setCashoutReceipt(updatedDetails);
    };
    const handleSelectedVendor = (e) => {
        const selectedName = e.target.value;
        const selectedEntry = vendors.find(entry => entry.vendorName === selectedName);
        if (selectedEntry) {
            setSelectedVendor(selectedEntry);
            setCashoutReceipt({
                ...cashoutReceipt,
                vendorName: selectedName,
                currentBalance: selectedEntry.remainingAmount
            });
        }
        else {
            setCashoutReceipt({
                ...cashoutReceipt,
                vendorName: selectedName,
                currentBalance: 0.00,
                remainingAmount: 0.00
            })
        }
    }

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

    const handleCashoutReceiptSubmit = async (e) => {
        e.preventDefault();
        try {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-GB');

            // Update the billDate in the cashoutReceipt
            const updatedReceipt = {
                ...cashoutReceipt,
                billDate: formattedDate
            };
            const action = await dispatch(createCashoutReceipt(updatedReceipt));
            const response = action.payload;

            if (action.type === 'cashoutReceipts/createCashoutReceipt/fulfilled' && response) {
                const updatedRemainingAmount = cashoutReceipt.currentBalance - cashoutReceipt.paidAmount;
                console.log("Selected:::", selectedVendor.id, updatedRemainingAmount);

                const updateVendorAction = await dispatch(updateVendorDetail({
                    vendorId: selectedVendor.id,
                    updatedData: { remainingAmount: updatedRemainingAmount }
                }));

                const updateVendorResponse = updateVendorAction.payload;
                if (updateVendorResponse) {
                    setCashoutReceipt({
                        vendorName: "",
                        currentBalance: "",
                        paidAmount: "",
                        remainingAmount: "",
                        billDate: "",
                        paymentType: "",
                        bankName: "",
                        bankPaymentType: "",
                        onlinePaymentGateway: "",
                        chequeNumber: "",
                        comments: "",
                    });
                    setSuccessMessage(true);
                    setSnackbarOpen(true);
                }
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Error occurred while processing the cashout receipt.");
            setErrorSnackbarOpen(true);
        }
    };


    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/cashout" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Cash-Out
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage Cash-Out Receipts</h2>
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
                    Successfully created cashout receipt!
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
            {(
                <div className="add-student_container">
                    <form onSubmit={handleCashoutReceiptSubmit} className='studentForm'>
                        <div className="form-group">
                            <label htmlFor="vendorName">Vendor Name:</label>
                            <select id="vendorName" name="vendorName" onChange={handleSelectedVendor} style={{ color: "black" }}>
                                <option>Select Vendor Name</option>
                                {vendors.map(vendor => (
                                    <option key={vendor.id} value={vendor.vendorName}>
                                        {vendor.vendorName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="currentBalance">Current Balance:</label>
                            <input
                                type="number"
                                id="currentBalance"
                                name="currentBalance"
                                value={cashoutReceipt.currentBalance || 0.00}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paidAmount">Paid Amount:</label>
                            <input
                                type="text"
                                id="paidAmount"
                                name="paidAmount"
                                max={cashoutReceipt.currentBalance}
                                value={cashoutReceipt.paidAmount}
                                onChange={handlePaidAmountChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="remainingAmount">Remaining Amount:</label>
                            <input
                                type="text"
                                id="remainingAmount"
                                name="remainingAmount"
                                value={cashoutReceipt.remainingAmount || "0.00"}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Payment Type:</label>
                            <div className="radio-row" style={{ display: "flex" }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="paymentType"
                                        value="cash"
                                        checked={cashoutReceipt.paymentType === 'cash'}
                                        onChange={handleInputChange} />
                                    <label htmlFor="cash">Cash</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="bank"
                                        name="paymentType"
                                        value="bank"
                                        checked={cashoutReceipt.paymentType === 'bank'}
                                        onChange={handleInputChange} />
                                    <label htmlFor="bank">Bank</label>
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', marginRight: '10px'
                                }}>
                                    <input
                                        type="radio"
                                        id="onlinePay"
                                        name="paymentType"
                                        value="onlinePay"
                                        checked={cashoutReceipt.paymentType === 'onlinePay'}
                                        onChange={handleInputChange} />
                                    <label htmlFor="onlinePay" style={{ whiteSpace: 'nowrap' }}>Online Pay</label>
                                </div>
                            </div>
                        </div>
                        {cashoutReceipt.paymentType === 'bank' && (
                            <div className="form-group">
                                <label>Bank Name:</label>
                                <select
                                    name="bankName"
                                    value={cashoutReceipt.bankName}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Bank</option>
                                    {bankNames.map(bank => (
                                        <option key={bank.id} value={bank.bankName}>{bank.bankName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {cashoutReceipt.paymentType === 'bank' && (
                            <div className="form-group">
                                <label>Bank Payment:</label>
                                <select
                                    name="bankPaymentType"
                                    value={cashoutReceipt.bankPaymentType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Bank Payment</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="IMPS">IMPS</option>
                                    <option value="RTGS">RTGS</option>
                                    <option value="CHEQUE">CHEQUE</option>
                                </select>
                            </div>
                        )}
                        {cashoutReceipt.bankPaymentType === 'CHEQUE' && (
                            <div className="form-group">
                                <label>Cheque No:</label>
                                <input
                                    type="text"
                                    name="chequeNumber"
                                    value={cashoutReceipt.chequeNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter Cheque Number"
                                />
                            </div>
                        )}
                        {
                            cashoutReceipt.paymentType === "onlinePay" && (
                                <div className="form-group">
                                    <label>Online Payment:</label>
                                    <select name="onlinePaymentGateway" onChange={handleInputChange} value={cashoutReceipt.onlinePaymentGateway}>
                                        <option value="">Select Payment Platform</option>
                                        {paymentPlatforms.map(platform => (
                                            <option key={platform.id} value={platform.platform}>{platform.platform}</option>
                                        ))}
                                    </select>
                                </div>
                            )
                        }
                        <div className="form-group">
                            <label htmlFor="comments">Comments:</label>
                            <textarea id="comments" name="comments" value={cashoutReceipt.comments} onChange={handleInputChange} />
                        </div>
                        <div className="full-width">
                            <div className="btn-submit">
                                <button type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            )
            }
        </div>
    );
};

export default CreateCashout;

