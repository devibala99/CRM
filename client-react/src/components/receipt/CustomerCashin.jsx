/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createReceipt } from '../features/customerReceiptSlice';
import { bankNames } from "./bankNames";
import { showInvoice, updateInvoice } from '../features/invoiceSlice';
import { paymentPlatforms } from "./paymentPlatforms";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Select from 'react-select';

const CustomerCashin = () => {
    const dispatch = useDispatch();
    const clientInvoice = useSelector(state => state.invoices.invoiceEntries);
    const [selectedInvoice, setSelectedInvoice] = useState([]);
    // snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);;
    useEffect(() => {
        dispatch(showInvoice());
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem("clientsKitkat", JSON.stringify(clientInvoice));
    }, [clientInvoice]);
    const [customerReceipt, setCustomerReceipt] = useState({
        customerName: "",
        currentBalance: "",
        paidAmount: "",
        billDate: "",
        paymentType: "",
        bankName: "",
        bankPaymentType: "",
        onlinePaymentGateway: "",
        chequeNumber: "",
        comments: ""
    });
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
    }
    const [selectedNameValue, setSelectedNameValue] = useState("");

    const handleSelectedCustomer = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : "";
        setSelectedNameValue(selectedValue);

        const selectedEntry = Array.isArray(clientInvoice) && clientInvoice.length > 0 ?
            clientInvoice.find(entry => entry.clientName === selectedValue) : null;
        if (selectedEntry) {
            setSelectedInvoice(selectedEntry);
            setCustomerReceipt({
                ...customerReceipt,
                customerName: selectedValue,
                currentBalance: (selectedEntry.remainingAmount).toFixed(2)
            });
        } else {
            setSelectedInvoice([]);
            setCustomerReceipt({
                ...customerReceipt,
                customerName: selectedValue,
                currentBalance: 0.00,
                remainingAmount: 0.00
            });
        }
    };

    const handlePaidAmountChange = (e) => {
        const { value } = e.target;
        const paidAmount = parseFloat(value);

        if (paidAmount > customerReceipt.currentBalance) {
            // console.log("greateer")
            setCustomerReceipt(prevState => ({
                ...prevState,
                paidAmount: 0.00
            }));
        }
        else {
            handleInputChangeCustomer(e);
        }
    };
    const handleInputChangeCustomer = (e) => {
        const { name, value } = e.target;
        const updatedDetails = {
            ...customerReceipt,
            [name]: value
        };

        if (name === "currentBalance" || name === "paidAmount") {
            const currentBalance = parseFloat(updatedDetails.currentBalance || 0.00);
            const paidAmount = parseFloat(updatedDetails.paidAmount || 0.00);
            updatedDetails.remainingAmount = (currentBalance - paidAmount).toFixed(2);
        }

        setCustomerReceipt(updatedDetails);
    };
    function formattedDate(dateValue) {
        if (!dateValue) return '';
        const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        if (isNaN(dateObj.getTime())) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    }
    const handleCustomerCashinSubmit = async (e) => {
        e.preventDefault();
        const today = new Date();
        const formattedDateValue = formattedDate(today);
        const updatedReceipt = {
            ...customerReceipt,
            billDate: formattedDateValue
        }
        try {
            const resultAction = await dispatch(createReceipt(updatedReceipt));
            const response = await resultAction.payload;

            if (response && response._id) {
                setCustomerReceipt({
                    customerName: "",
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
                })
                setSuccessMessage(true);
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Error occurred while processing the receipt.");
            setErrorSnackbarOpen(true);
        }
    };

    return (
        <div className='student-view-container' style={{ border: "none" }}>
            <div className="add-student_container">
                <form onSubmit={handleCustomerCashinSubmit} className='studentForm'>

                    <div className="form-group" style={{ width: "100%" }}>
                        <label htmlFor="customerName" style={{ paddingBottom: ".4rem" }}>Customer Name:</label>
                        <Select
                            id="customerName"
                            name="customerName"
                            value={clientInvoice.length > 0 ? clientInvoice.find(option => option.label === selectedNameValue) : ''}
                            onChange={handleSelectedCustomer}
                            options={clientInvoice.length > 0 ? clientInvoice.filter(customer => customer.remainingAmount > 0).map(entry => ({
                                value: entry.clientName,
                                label: entry.clientName
                            })) : []}
                            isSearchable={true}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: "100%",
                                }),
                                valueContainer: (provided) => ({ ...provided, textAlign: "left" }),
                                menu: (provided) => ({ ...provided, textAlign: "left" }),
                                option: (provided) => ({ ...provided, textAlign: "left" })
                            }}
                        />

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
                            Successfully created!
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
                    <div className="form-group">
                        <label htmlFor="currentBalance">Current Balance:</label>
                        <input
                            type="number"
                            id="currentBalance"
                            name="currentBalance"
                            value={customerReceipt.currentBalance || 0.00}
                            onChange={handleInputChangeCustomer}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paidAmount">Paid Amount:</label>
                        <input
                            type="text"
                            id="paidAmount"
                            name="paidAmount"
                            max={customerReceipt.currentBalance}
                            value={customerReceipt.paidAmount}
                            onChange={handlePaidAmountChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="remainingAmount">Remaining Amount:</label>
                        <input
                            type="text"
                            id="remainingAmount"
                            name="remainingAmount"
                            value={customerReceipt.remainingAmount || "0.00"}
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
                                    checked={customerReceipt.paymentType === 'cash'}
                                    onChange={handleInputChangeCustomer} />
                                <label htmlFor="cash">Cash</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="bank"
                                    name="paymentType"
                                    value="bank"
                                    checked={customerReceipt.paymentType === 'bank'}
                                    onChange={handleInputChangeCustomer} />
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
                                    checked={customerReceipt.paymentType === 'onlinePay'}
                                    onChange={handleInputChangeCustomer} />
                                <label htmlFor="onlinePay" style={{ whiteSpace: 'nowrap' }}>Online Pay</label>
                            </div>
                        </div>
                    </div>
                    {customerReceipt.paymentType === 'bank' && (
                        <div className="form-group">
                            <label>Bank Name:</label>
                            <select
                                name="bankName"
                                value={customerReceipt.bankName}
                                onChange={handleInputChangeCustomer}
                            >
                                <option value="">Select Bank</option>
                                {bankNames.map(bank => (
                                    <option key={bank.id} value={bank.bankName}>{bank.bankName}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {customerReceipt.paymentType === 'bank' && (
                        <div className="form-group">
                            <label>Bank Payment:</label>
                            <select
                                name="bankPaymentType"
                                value={customerReceipt.bankPaymentType}
                                onChange={handleInputChangeCustomer}
                            >
                                <option value="">Select Bank Payment</option>
                                <option value="NEFT">NEFT</option>
                                <option value="IMPS">IMPS</option>
                                <option value="RTGS">RTGS</option>
                                <option value="CHEQUE">CHEQUE</option>

                            </select>
                        </div>
                    )}
                    {customerReceipt.bankPaymentType === 'CHEQUE' && (
                        <div className="form-group">
                            <label>Cheque No:</label>
                            <input
                                type="text"
                                name="chequeNumber"
                                value={customerReceipt.chequeNumber}
                                onChange={handleInputChangeCustomer}
                                placeholder="Enter Cheque Number"
                            />
                        </div>
                    )}
                    {
                        customerReceipt.paymentType === "onlinePay" && (
                            <div className="form-group">
                                <label>Online Payment:</label>
                                <select name="onlinePaymentGateway" onChange={handleInputChangeCustomer} value={customerReceipt.onlinePaymentGateway}>
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
                        <textarea id="comments" name="comments" value={customerReceipt.comments} onChange={handleInputChangeCustomer} />
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

export default CustomerCashin;

