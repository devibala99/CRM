/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import { useDispatch, useSelector } from 'react-redux';
import { showStudents, updateStudent } from '../features/studentsSlice';
import { createReceipt } from '../features/studentReceiptSlice';
import { bankNames } from "./bankNames";
import { paymentPlatforms } from "./paymentPlatforms";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CustomerCashin from "./CustomerCashin"
import Select from 'react-select';

const CreateCashin = () => {
    const [cashInPerson, setCashInPerson] = useState(() => localStorage.getItem('cashInPerson') || "");

    const dispatch = useDispatch();
    const students = useSelector(state => state.students.entries);
    const [selectedStudent, setSelectedStudent] = useState([]);

    const studentReceiptData = useSelector(state => state.studentReceipts.studentReceiptEntries);
    // snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);;
    useEffect(() => {
        dispatch(showStudents());
    }, [dispatch]);
    useEffect(() => {
        localStorage.setItem("studentsKitkat", JSON.stringify(students));
    }, [students]);
    useEffect(() => {
        localStorage.setItem('cashInPerson', cashInPerson);
    }, [cashInPerson]);


    const handleCashInPersonChange = (e) => {
        const newValue = e.target.value;
        setCashInPerson(newValue);
        localStorage.setItem('cashInPerson', newValue);
    };
    const [studentReceipt, setStudentReceipt] = useState({
        studentName: "",
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

    const handlePaidAmountChange = (e) => {
        const { value } = e.target;
        const paidAmount = parseFloat(value);

        if (paidAmount > studentReceipt.currentBalance) {
            setStudentReceipt(prevState => ({
                ...prevState,
                paidAmount: 0.00
            }));
        } else {
            handleInputChangeStudent(e);
        }
    };
    const handleInputChangeStudent = (e) => {
        const { name, value } = e.target;
        let updatedDetails = { ...studentReceipt, [name]: value };

        if (name === "currentBalance" || name === "paidAmount") {
            const currentBalance = parseFloat(updatedDetails.currentBalance || 0.00);
            const paidAmount = parseFloat(updatedDetails.paidAmount || 0.00);
            updatedDetails.remainingAmount = currentBalance - paidAmount;
        }

        setStudentReceipt(updatedDetails);
    };

    const [selectedNameValue, setSelectedNameValue] = useState("");
    const handleSelectedStudent = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : "";
        setSelectedNameValue(selectedValue);

        const selectedEntry = students.find(entry => `${entry.firstName} ${entry.lastName}` === selectedValue);
        if (selectedEntry) {
            setSelectedStudent(selectedEntry);
            setStudentReceipt({
                ...studentReceipt,
                studentName: selectedValue,
                currentBalance: selectedEntry.remainingAmount,
            });
        } else {
            setStudentReceipt({
                ...studentReceipt,
                studentName: selectedValue,
                currentBalance: 0.00,
                remainingAmount: 0.00
            });
        }
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
    }
    const handleStudentReceiptSubmit = async (e) => {
        e.preventDefault();
        try {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-GB');
            const updatedReceipt = {
                ...studentReceipt,
                billDate: formattedDate
            };

            const createReceiptAction = await dispatch(createReceipt(updatedReceipt));
            const createReceiptResponse = createReceiptAction.payload;

            // console.log(createReceiptAction, createReceiptResponse);

            if (createReceiptAction.type === 'studentReceipts/createReceipt/fulfilled') {
                const updatedRemainingAmount = studentReceipt.currentBalance - studentReceipt.paidAmount;

                const updateStudentAction = await dispatch(updateStudent({
                    id: selectedStudent?.id,
                    data: { remainingAmount: updatedRemainingAmount }
                }));
                const updateStudentResponse = updateStudentAction.payload;

                if (updateStudentResponse) {
                    setStudentReceipt({
                        studentName: "",
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
            setErrorMessage("Error occurred while processing the receipt.");
            setErrorSnackbarOpen(true);
        }
    };


    return (

        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/cashin" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Cash In
                        </Link>
                    </div>
                    {
                        cashInPerson.length > 0 ? (
                            <h2 style={{ color: "#0090dd" }}>Create {cashInPerson.charAt(0).toUpperCase() + cashInPerson.slice(1)} Cash In</h2>
                        ) : (
                            <h2 style={{ color: "#0090dd" }}>Create Cash In</h2>
                        )
                    }
                    <div className="radio-btn-input" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                        <div className="form-group">
                            <div className="radio-row-select" style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="student"
                                        name="cashin"
                                        value="student"
                                        checked={cashInPerson === 'student'}
                                        onChange={handleCashInPersonChange}
                                    />
                                    <label htmlFor="student">Student</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="customer"
                                        name="cashin"
                                        value="customer"
                                        checked={cashInPerson === 'customer'}
                                        onChange={handleCashInPersonChange}
                                    />
                                    <label htmlFor="customer">Customer</label>
                                </div>
                            </div>
                        </div>
                    </div>
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
            {
                (cashInPerson === "student") && (
                    <div className="add-student_container">
                        <form onSubmit={handleStudentReceiptSubmit} className='studentForm'>
                            <div className="form-group">
                                <label htmlFor="studentName">Student Name:</label>
                                <Select
                                    id="studentName"
                                    name="studentName"
                                    value={students.find(option => option.label === selectedStudent)}
                                    onChange={handleSelectedStudent}
                                    options={students.filter(student => student.remainingAmount > 0).map(entry => ({
                                        value: `${entry.firstName} ${entry.lastName}`,
                                        label: `${entry.firstName} ${entry.lastName}`
                                    }))}
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
                            <div className="form-group">
                                <label htmlFor="currentBalance">Current Balance:</label>
                                <input
                                    type="number"
                                    id="currentBalance"
                                    name="currentBalance"
                                    value={studentReceipt.currentBalance || 0.00}
                                    onChange={handleInputChangeStudent}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="paidAmount">Paid Amount:</label>
                                <input
                                    type="text"
                                    id="paidAmount"
                                    name="paidAmount"
                                    max={studentReceipt.currentBalance}
                                    value={studentReceipt.paidAmount}
                                    onChange={handlePaidAmountChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="remainingAmount">Remaining Amount:</label>
                                <input
                                    type="text"
                                    id="remainingAmount"
                                    name="remainingAmount"
                                    value={studentReceipt.remainingAmount || "0.00"}
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
                                            checked={studentReceipt.paymentType === 'cash'}
                                            onChange={handleInputChangeStudent} />
                                        <label htmlFor="cash">Cash</label>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                        <input
                                            type="radio"
                                            id="bank"
                                            name="paymentType"
                                            value="bank"
                                            checked={studentReceipt.paymentType === 'bank'}
                                            onChange={handleInputChangeStudent} />
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
                                            checked={studentReceipt.paymentType === 'onlinePay'}
                                            onChange={handleInputChangeStudent} />
                                        <label htmlFor="onlinePay" style={{ whiteSpace: 'nowrap' }}>Online Pay</label>
                                    </div>
                                </div>
                            </div>
                            {studentReceipt.paymentType === 'bank' && (
                                <div className="form-group">
                                    <label>Bank Name:</label>
                                    <select
                                        name="bankName"
                                        value={studentReceipt.bankName}
                                        onChange={handleInputChangeStudent}
                                    >
                                        <option value="">Select Bank</option>
                                        {bankNames.map(bank => (
                                            <option key={bank.id} value={bank.bankName}>{bank.bankName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {studentReceipt.paymentType === 'bank' && (
                                <div className="form-group">
                                    <label>Bank Payment:</label>
                                    <select
                                        name="bankPaymentType"
                                        value={studentReceipt.bankPaymentType}
                                        onChange={handleInputChangeStudent}
                                    >
                                        <option value="">Select Bank Payment</option>
                                        <option value="NEFT">NEFT</option>
                                        <option value="IMPS">IMPS</option>
                                        <option value="RTGS">RTGS</option>
                                        <option value="CHEQUE">CHEQUE</option>

                                    </select>
                                </div>
                            )}
                            {studentReceipt.bankPaymentType === 'CHEQUE' && (
                                <div className="form-group">
                                    <label>Cheque No:</label>
                                    <input
                                        type="text"
                                        name="chequeNumber"
                                        value={studentReceipt.chequeNumber}
                                        onChange={handleInputChangeStudent}
                                        placeholder="Enter Cheque Number"
                                    />
                                </div>
                            )}
                            {
                                studentReceipt.paymentType === "onlinePay" && (
                                    <div className="form-group">
                                        <label>Online Payment:</label>
                                        <select name="onlinePaymentGateway" onChange={handleInputChangeStudent} value={studentReceipt.onlinePaymentGateway}>
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
                                <textarea id="comments" name="comments" value={studentReceipt.comments} onChange={handleInputChangeStudent} />
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

            {
                cashInPerson === 'customer' && (
                    <CustomerCashin />
                )
            }

        </div>
    );
};

export default CreateCashin;
