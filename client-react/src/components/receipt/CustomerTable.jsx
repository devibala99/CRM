/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { showInvoice, updateInvoice } from '../features/invoiceSlice';
import { getReceipts, deleteReceipt } from '../features/customerReceiptSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import DetailsModal from './DetailsModal';
import "../personInfo/viewTable.css";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import logoKitkat from "../../navigationbar/assets/kitkat-removebg-preview.png"
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Pagination from '@mui/material/Pagination';

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});
const StyledTableRow = styled(TableRow)({
    height: '15px',
});
// Custom styled components for Previous and Next buttons
const PrevButton = styled('button')({
    color: '#0090dd',
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    borderRadius: '4px',
    padding: '8px 10px',
    fontSize: '13px',
    margin: '0 10px',
    cursor: 'pointer',
    border: 'none',
});

const NextButton = styled('button')({
    color: '#0090dd',
    backgroundColor: 'transparent',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    borderRadius: '4px',
    padding: '8px 10px',
    fontSize: '13px',
    margin: '0 10px',
    cursor: 'pointer',
    border: 'none',
});
const ActivePagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: '#000',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#0090dd',
        color: '#fff',
    },
}));
const CustomerTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // Pagination
    const [page, setPage] = useState(1);
    const customersPerPage = 10;
    const indexOfLastCustomer = page * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const handleChangePage = (event, value) => {
        setPage(value);
    };

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
        // console.log(customer, "clicked");
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // console.log(searchTerm);
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

    const handlePdfDownload = (customer) => {
        const { customerName, paymentType, paidAmount, remainingAmount, billDate } = customer;

        // Create new jsPDF instance with A5 format
        const doc = new jsPDF({
            format: 'a5',
            orientation: 'portrait',
            unit: 'mm',  // set measurement unit to millimeters
        });
        const a5PaperHeight = doc.internal.pageSize.height;

        console.log("Height of A5 paper:", a5PaperHeight, "mm");
        // Set the desired width for the title columns
        const titleWidth = 25;

        // Set the padding and border color
        const padding = 10;
        const borderColor = '#808080';

        // Add border around the content
        doc.setDrawColor(borderColor);
        doc.rect(padding, padding, doc.internal.pageSize.width - 2 * padding, doc.internal.pageSize.height - 2 * padding);

        // Add logo aligned left with padding
        const logoImg = logoKitkat; // Replace with the path to your logo image
        const logoWidth = 40;
        const logoHeight = 20;
        const logoPadding = 5;
        doc.addImage(logoImg, 'PNG', padding + logoPadding, padding + logoPadding, logoWidth, logoHeight); // Adjust position and size as needed

        // Add two break spaces
        doc.text('', padding + logoPadding, padding + logoPadding + logoHeight + padding);

        // Add "Bill Acknowledgement" aligned right next to the logo with bold text
        const textRightMargin = doc.internal.pageSize.width - padding - logoPadding;
        const textYPosition = padding + logoPadding + logoHeight / 2;
        doc.setFontSize(12); // Set font size for titles
        doc.setFont('bold'); // Set font to bold
        doc.text('BILL ACKNOWLEDGEMENT', textRightMargin, textYPosition, { align: 'right' });

        // Reset font to normal
        doc.setFont('normal');

        // Add titles with specified width below the logo
        const titleYPosition = padding + logoPadding + logoHeight + 2 * padding;
        doc.setFontSize(12); // Set font size for titles
        doc.text('Customer Name:', padding + logoPadding, titleYPosition);
        doc.text('Payment Type:', padding + logoPadding, titleYPosition + 10);
        doc.text('Paying Amount:', padding + logoPadding, titleYPosition + 20);
        doc.text('Balance Amount:', padding + logoPadding, titleYPosition + 30);
        doc.text('Receipt Date:', padding + logoPadding, titleYPosition + 40);

        // Add customer data with specified width and left-aligned below the titles
        const dataYPosition = padding + logoPadding + logoHeight + 2 * padding;
        const dataXPosition = padding + logoPadding + titleWidth + 5;
        doc.setFontSize(12); // Set font size for data values
        doc.text(customerName, dataXPosition, dataYPosition);
        doc.text(paymentType, dataXPosition, dataYPosition + 10);
        doc.text(paidAmount.toString(), dataXPosition, dataYPosition + 20);
        doc.text(remainingAmount.toString(), dataXPosition, dataYPosition + 30);
        doc.text(billDate, dataXPosition, dataYPosition + 40);

        // Add "NOTE: Amount Cannot Be Refund" below the customer data
        const noteYPosition = padding + logoPadding + logoHeight + 1.5 * padding + 60;
        doc.text('NOTE: Amount Cannot Be Refund', padding + logoPadding, noteYPosition);

        // Add HR Signature
        const signatureYPosition = noteYPosition + 2 * padding;
        doc.text('HR Signature', padding + logoPadding, signatureYPosition);

        // Save the PDF
        doc.save(`${customerName}CustomerReceipt.pdf`);
    };


    const confirmDelete = async (fieldToDelete) => {
        try {
            // console.log(`Deleting field with ID: ${fieldToDelete}`);

            const selectedCustomer = customersReceipt.find(customer => customer._id === fieldToDelete);
            const selectedCustomerToUpdate = invoiceList.find(customer => customer.clientName === (selectedCustomer.customerName));
            // console.log(invoiceList, selectedCustomerToUpdate, selectedCustomer);

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
                                                        <VisibilityIcon className="display-view-btn" onClick={() => handleDisplayModalOpen(customer)} />
                                                    </Tooltip>
                                                    <Tooltip title="Download PDF">
                                                        <PictureAsPdfIcon className="pdf-download-btn" onClick={() => handlePdfDownload(customer)} />
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteIcon className="delete-view-btn" onClick={() => handleDeleteClick(customer)} />
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingBottom: "2rem" }}>
                <PrevButton
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </PrevButton>
                <ActivePagination
                    count={Math.ceil(customersReceipt.length / customersPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    hideNextButton
                    hidePrevButton
                />

                <NextButton
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page === Math.ceil(customersReceipt.length / customersPerPage)}
                >
                    Next
                </NextButton>
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
                            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h1>Customer Cash In</h1>
                                </div>
                                <div>
                                    <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                                </div>
                            </div>
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
