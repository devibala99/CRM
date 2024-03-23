/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { showInvoice, updateInvoice } from '../features/invoiceSlice';
import { getReceipts, deleteReceipt } from '../features/customerReceiptSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tooltip, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import DetailsModal from './DetailsModal';
import "../personInfo/viewTable.css";

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#0090dd",
});

const StyledTableCell = styled(TableCell)({
    color: 'white',
    fontWeight: 'bold',
    fontSize: "15px",
});
const StyledTableRow = styled(TableRow)({
    height: '15px',
});

const CustomerTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // Pagination
    const [page, setPage] = useState(1);
    const customersPerPage = 5;
    const indexOfLastCustomer = page * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const customersReceipt = useSelector(state => state.customerReceipts.customerReceiptEntries);
    const invoiceList = useSelector(state => state.invoices.invoiceEntries);
    useEffect(() => {
        dispatch(getReceipts());
        dispatch(showInvoice());
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem("customersReceipts", JSON.stringify(customersReceipt));
    }, [customersReceipt]);

    useEffect(() => {
        const filtered = customersReceipt.filter(customer =>
            (customer.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }, [customersReceipt, searchTerm]);

    const handleDisplayModalOpen = (customer) => {
        setSelectedCustomer(customer);
        setDisplayModalOpen(true);
        setShowModal(true);
        console.log(customer, "clicked");
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log(searchTerm);
    };

    const handleDeleteClick = (customer) => {
        setIsWarningModalOpen(true);
        console.log(customer._id);
        setFieldToDelete(customer._id);
        setCustomerName(customer.customerName);
    };

    const handleCancel = () => {
        setIsWarningModalOpen(false);
        setShowModal(false);
    };

    const confirmDelete = async (fieldToDelete) => {
        try {
            console.log(`Deleting field with ID: ${fieldToDelete}`);

            const selectedCustomer = customersReceipt.find(customer => customer._id === fieldToDelete);
            const selectedCustomerToUpdate = invoiceList.find(customer => customer.clientName === (selectedCustomer.customerName));
            console.log(invoiceList, selectedCustomerToUpdate, selectedCustomer);

            const updatedRemainingAmount = parseFloat(selectedCustomer.remainingAmount) + parseFloat(selectedCustomer.paidAmount);

            await dispatch(updateInvoice({
                id: selectedCustomerToUpdate._id,
                updatedData: { remainingAmount: updatedRemainingAmount }
            }));

            await dispatch(deleteReceipt(fieldToDelete));
            setIsWarningModalOpen(false);

            window.location.reload();
        } catch (error) {
            console.error('Error confirming delete:', error);
        }
    };


    return (
        <div className='customer-view-container'>
            <div className="table-view">
                <input
                    className="input-table-search"
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ padding: "12px", fontSize: "1rem", border: "1px solid rgba(159, 159, 159, 0.497)" }}
                />
                <div className="table-container">
                    <TableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <StyledTableCell>S.No</StyledTableCell>
                                    <StyledTableCell>Customer Name</StyledTableCell>
                                    <StyledTableCell>Receipt Type</StyledTableCell>
                                    <StyledTableCell>Payment Type</StyledTableCell>
                                    <StyledTableCell>Paying Amount</StyledTableCell>
                                    <StyledTableCell>Balance Amount</StyledTableCell>
                                    <StyledTableCell>Receipt Date</StyledTableCell>
                                    <StyledTableCell style={{ textAlign: "center" }}>Action</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>
                            {
                                currentCustomers.length === 0 ? (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                No Customer Receipt Found. Add Customer Receipt.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {currentCustomers.map((customer, index) => (
                                            <StyledTableRow key={customer._id} style={{ backgroundColor: index % 2 === 1 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                                <TableCell style={{ fontSize: "13px" }}>{index + 1}.</TableCell>
                                                <TableCell style={{ fontSize: "13px" }}>{customer.customerName}</TableCell>
                                                <TableCell style={{ fontSize: "13px" }}>Cash-In</TableCell>
                                                <TableCell style={{ fontSize: "13px" }}>{customer.paymentType}</TableCell>
                                                <TableCell style={{ fontSize: "13px" }}>{customer.paidAmount}</TableCell>
                                                <TableCell style={{ fontSize: "13px" }}>{customer.remainingAmount}</TableCell>
                                                <TableCell style={{ fontSize: "13px" }}>{customer.billDate}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Display Receipt">
                                                        <Button onClick={() => handleDisplayModalOpen(customer)}>
                                                            <VisibilityIcon />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <Button onClick={() => handleDeleteClick(customer)}>
                                                            <DeleteIcon />
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                )
                            }
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Pagination count={Math.ceil(filteredCustomers.length / customersPerPage)} page={page} onChange={handlePageChange} style={{ marginBottom: "2rem" }} />
            </div>
            {/* Delete the details*/}

            {isWarningModalOpen && (
                <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                    <div className="modalContent">
                        <img src={warningSign} alt="Warning" className="warningImage" />
                        <h3>Delete {customerName}'s Receipt ?</h3>
                        <p className="warningText">You will not be able to recover the customer details.</p>
                        <div className="buttonsContainer">
                            <button onClick={() => confirmDelete(fieldToDelete)} className="deleteButton">Delete</button>
                            <button onClick={handleCancel} className="cancelButton">Cancel</button>
                        </div>
                    </div>
                </WarningModal>
            )}
            {/* Display the details*/}
            {
                showModal && (
                    <DetailsModal isOpen={showModal} onClose={handleCancel} fieldToShow={fieldToDelete}>
                        <div className="view-modal-container">
                            <h1>Customer Cash In</h1>
                            <div className="modal-flex" style={{ border: "1px solid rgba(159, 159, 159, 0.497)" }}>
                                <div className="left-container">
                                    <p>Customer Name</p>
                                    <p>Bill Date</p>
                                    <p>Payment Method</p>
                                    {
                                        selectedCustomer.paymentType === "bank" && (
                                            <p>Bank Name</p>
                                        )
                                    }
                                    {
                                        selectedCustomer.paymentType === "bank" && (
                                            <p>Bank Payment Type</p>
                                        )
                                    }
                                    {
                                        selectedCustomer.bankPaymentType === "CHEQUE" && (
                                            <p>Cheque Number</p>
                                        )
                                    }
                                    {
                                        selectedCustomer.paymentType === "onlinePay" && (
                                            <p>Online Payment Gateway</p>
                                        )
                                    }
                                    <p>Previous Balance</p>
                                    <p>Paid Amount</p>
                                    <p>Remaining Balance</p>
                                </div>
                                <div className="right-container">
                                    <p>{selectedCustomer.customerName}</p>
                                    <p>{selectedCustomer.billDate}</p>
                                    <p>{selectedCustomer.paymentType.charAt(0).toUpperCase() + selectedCustomer.paymentType.slice(1)}</p>
                                    {
                                        selectedCustomer.paymentType === "bank" && (
                                            <p>{selectedCustomer.bankName}</p>
                                        )
                                    }
                                    {
                                        selectedCustomer.paymentType === "bank" && (
                                            <p>{selectedCustomer.bankPaymentType}</p>
                                        )
                                    }
                                    {
                                        selectedCustomer.paymentType === "onlinePay" && (
                                            <p>{selectedCustomer.onlinePaymentGateway}</p>
                                        )
                                    }
                                    {
                                        selectedCustomer.bankPaymentType === "CHEQUE" && (
                                            <p>{selectedCustomer.chequeNumber}</p>
                                        )
                                    }
                                    <p>{selectedCustomer.currentBalance}</p>
                                    <p>{selectedCustomer.paidAmount}</p>
                                    <p>{selectedCustomer.remainingAmount}</p>
                                </div>
                            </div>
                        </div>
                    </DetailsModal>
                )
            }
        </div>
    );
};

export default CustomerTable;
