import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCashoutReceipts, deleteCashoutReceipt } from '../features/cashoutReceiptsSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import DetailsModal from './DetailsModal';
import Pagination from '@mui/material/Pagination'

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
const Cashout = () => {
    const dispatch = useDispatch();
    const [filteredCashoutReceipts, setFilteredCashoutReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const cashoutReceipts = useSelector(state => state.cashoutReceipts.cashoutReceiptEntries);
    const cashoutReceiptsPerPage = 5;
    const indexOfLastReceipt = page * cashoutReceiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - cashoutReceiptsPerPage;
    const currentReceipts = filteredCashoutReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [receiptIdToDelete, setReceiptIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null)
    useEffect(() => {
        dispatch(getCashoutReceipts());
    }, [dispatch]);

    useEffect(() => {
        setFilteredCashoutReceipts(cashoutReceipts);
    }, [cashoutReceipts]);

    useEffect(() => {
        const filtered = cashoutReceipts.filter(receipt =>
            (receipt.vendorName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        setFilteredCashoutReceipts(filtered);
    }, [cashoutReceipts, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleDisplayModalOpen = (person) => {
        setSelectedPerson(person);
        setShowModal(true);
    };
    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const handleDeleteClick = (receiptId) => {
        setIsWarningModalOpen(true);
        setReceiptIdToDelete(receiptId);
    };

    const handleCancel = () => {
        setIsWarningModalOpen(false);
        setShowModal(false);
    };

    const confirmDelete = (receiptId) => {
        dispatch(deleteCashoutReceipt(receiptId));
        setIsWarningModalOpen(false);
    };

    return (
        <div className='student-view-container'>
            {/* Bread Crumb */}
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/createCashOut" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Create
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage Cash-Out Receipts</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            {/* Table View */}
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
                                    <StyledTableCell>Vendor Name</StyledTableCell>
                                    <StyledTableCell>Current Balance</StyledTableCell>
                                    <StyledTableCell>Paid Amount</StyledTableCell>
                                    <StyledTableCell>Remaining Amount</StyledTableCell>
                                    <StyledTableCell>Bill Date</StyledTableCell>
                                    <StyledTableCell>Payment Type</StyledTableCell>
                                    <StyledTableCell style={{ textAlign: "center" }}>Action</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>
                            {
                                currentReceipts.length === 0 ? (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                No Cash-Out Receipt Found. Add Receipts.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {currentReceipts.map((receipt, index) => (
                                            <StyledTableRow key={receipt._id} style={{ backgroundColor: index % 2 === 0 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{receipt.vendorName}</TableCell>
                                                <TableCell>{receipt.currentBalance}</TableCell>
                                                <TableCell>{receipt.paidAmount}</TableCell>
                                                <TableCell>{receipt.remainingAmount}</TableCell>
                                                <TableCell>{receipt.billDate}</TableCell>
                                                <TableCell>{receipt.paymentType}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Display Receipt">
                                                        <VisibilityIcon onClick={() => handleDisplayModalOpen(receipt)} className="display-view-btn" />
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteIcon onClick={() => handleDeleteClick(receipt._id)} className="delete-view-btn" />
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingBottom: "2rem" }}>
                    <PrevButton
                        onClick={() => handleChangePage(null, page - 1)}
                        disabled={page === 1}
                    >
                        Prev
                    </PrevButton>
                    <ActivePagination
                        count={Math.ceil(filteredCashoutReceipts.length / cashoutReceiptsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                        hideNextButton
                        hidePrevButton
                    />

                    <NextButton
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={page === Math.ceil(filteredCashoutReceipts.length / cashoutReceiptsPerPage)}
                    >
                        Next
                    </NextButton>
                </div>

            </div>

            {/* Delete warning modal */}
            {
                isWarningModalOpen && (
                    <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Are you sure you want to delete this receipt?</h3>
                            <div className="buttonsContainer">
                                <button onClick={() => confirmDelete(receiptIdToDelete)} className="deleteButton">Delete</button>
                                <button onClick={handleCancel} className="cancelButton">Cancel</button>
                            </div>
                        </div>
                    </WarningModal>
                )
            }
            {
                showModal && (
                    <DetailsModal isOpen={showModal} onClose={handleCancel}>
                        <div className="view-modal-container">
                            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h1>Cash In</h1>
                                </div>
                                <div>
                                    <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                                </div>
                            </div>
                            <div className="modal-flex" style={{ border: "1px solid rgba(159, 159, 159, 0.497)" }}>
                                <div className="left-container">
                                    <p>Vendor Name</p>
                                    <p>Bill Date</p>
                                    <p>Payment Method</p>
                                    {
                                        selectedPerson.paymentType === "bank" && (
                                            <p>Bank Name</p>
                                        )
                                    }
                                    {
                                        selectedPerson.paymentType === "bank" && (
                                            <p>Bank Payment Type</p>
                                        )
                                    }
                                    {
                                        selectedPerson.bankPaymentType === "CHEQUE" && (
                                            <p>Cheque Number</p>
                                        )
                                    }
                                    {
                                        selectedPerson.paymentType === "onlinePay" && (
                                            <p>Online Payment Gateway</p>
                                        )
                                    }
                                    <p>Previous Balance</p>
                                    <p>Paid Amount</p>
                                    <p>Remaining Balance</p>
                                    {
                                        selectedPerson.comments && (
                                            <p>Comments</p>
                                        )
                                    }
                                </div>
                                <div className="right-container">
                                    <p>{selectedPerson.vendorName}</p>
                                    <p>{selectedPerson.billDate}</p>
                                    <p>{selectedPerson.paymentType.charAt(0).toUpperCase() + selectedPerson.paymentType.slice(1)}</p>
                                    {
                                        selectedPerson.paymentType === "bank" && (
                                            <p>{selectedPerson.bankName}</p>
                                        )
                                    }
                                    {
                                        selectedPerson.paymentType === "bank" && (
                                            <p>{selectedPerson.bankPaymentType}</p>
                                        )
                                    }
                                    {
                                        selectedPerson.paymentType === "onlinePay" && (
                                            <p>{selectedPerson.onlinePaymentGateway}</p>
                                        )
                                    }
                                    {
                                        selectedPerson.bankPaymentType === "CHEQUE" && (
                                            <p>{selectedPerson.chequeNumber}</p>
                                        )
                                    }
                                    <p>{selectedPerson.currentBalance}</p>
                                    <p>{selectedPerson.paidAmount}</p>
                                    <p>{selectedPerson.remainingAmount}</p>
                                    {
                                        selectedPerson.comments && (
                                            <p>{selectedPerson.comments}</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                    </DetailsModal>
                )
            }
        </div>
    );
};

export default Cashout;
