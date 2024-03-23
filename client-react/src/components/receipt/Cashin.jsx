/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getReceipts, deleteReceipt } from '../features/studentReceiptSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tooltip, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/system';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import { showStudents, updateStudent } from '../features/studentsSlice';
import "../personInfo/viewTable.css";
import "./detailModal.css"
import CustomerTable from './CustomerTable';
import DetailsModal from './DetailsModal';
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

const Cashin = () => {
    const [cashInPerson, setCashInPerson] = useState(() => localStorage.getItem('cashInPerson') || "");
    const dispatch = useDispatch();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const studentsReceipt = useSelector(state => state.studentReceipts.studentReceiptEntries);
    const studentsList = useSelector(state => state.students.entries);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    // Pagination
    const [page, setPage] = useState(1);
    const studentsPerPage = 5;
    const indexOfLastStudent = page * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [studentFirstName, setStudentFirstName] = useState('');
    // modal
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        dispatch(getReceipts());
        dispatch(showStudents());
    }, [dispatch]);
    useEffect(() => {
        localStorage.setItem("studentsReceipts", JSON.stringify(studentsReceipt));
    }, [studentsReceipt]);
    useEffect(() => {
        localStorage.setItem("cashInPerson", cashInPerson);
    }, [cashInPerson]);
    useEffect(() => {
        const filtered = studentsReceipt.filter(student =>
            (student.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [studentsReceipt, searchTerm]);
    const handleDisplayModalOpen = (student) => {
        setSelectedStudent(student);
        setDisplayModalOpen(true);
        setShowModal(true);
        console.log(student, "clicked");
    };
    const handleCashInPersonChange = (e) => {
        const newValue = e.target.value;
        setCashInPerson(newValue);
        localStorage.setItem('cashInPerson', newValue);
    };
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log(searchTerm);
    };
    const handleDeleteClick = (student) => {
        setIsWarningModalOpen(true);
        console.log(student._id);
        setFieldToDelete(student._id);
        setStudentFirstName(student.studentName);
    };
    const handleCancel = () => {
        setIsWarningModalOpen(false);
        setShowModal(false);
    };

    const confirmDelete = async (fieldToDelete) => {
        try {
            console.log(`Deleting field with ID: ${fieldToDelete}`);

            const selectedStudent = studentsReceipt.find(student => student._id === fieldToDelete);
            const selectedCustomerToUpdate = studentsList.find(student => `${student.firstName} ${student.lastName}` ===
                (selectedStudent.studentName)
            );
            console.log(studentsList, selectedCustomerToUpdate, selectedStudent);

            const updatedRemainingAmount = parseFloat(selectedStudent.remainingAmount) + parseFloat(selectedStudent.paidAmount);

            await dispatch(updateStudent({
                id: selectedCustomerToUpdate.id,
                data: { remainingAmount: updatedRemainingAmount }
            }));

            await dispatch(deleteReceipt(fieldToDelete));
            setIsWarningModalOpen(false);

            window.location.reload();
        } catch (error) {
            console.error('Error confirming delete:', error);
        }
    };

    return (
        <div className='student-view-container'>
            {/* Bread Crumb */}
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/createCashIn" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Create
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage {cashInPerson ? cashInPerson.charAt(0).toUpperCase() + cashInPerson.slice(1) : 'Cash In'}</h2>
                    {/* Radio Buttons */}
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
            {/* Table View */}
            {cashInPerson === "student" && (
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
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Receipt Type</StyledTableCell>
                                        <StyledTableCell>Payment Type</StyledTableCell>
                                        <StyledTableCell>Paying Amount</StyledTableCell>
                                        <StyledTableCell>Balance Amount</StyledTableCell>
                                        <StyledTableCell>Receipt Date</StyledTableCell>
                                        <StyledTableCell style={{ textAlign: "center" }}>Action</StyledTableCell>
                                    </TableRow>
                                </StyledTableHead>
                                {
                                    currentStudents.length === 0 ? (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={9} align="center">
                                                    No Student Receipt Found. Add Student Receipt.
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    ) : (
                                        <TableBody>
                                            {currentStudents.map((studentsReceipt, index) => (
                                                <StyledTableRow key={studentsReceipt._id} style={{ backgroundColor: index % 2 === 0 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                                    <TableCell style={{ fontSize: "13px" }}>{index + 1}.</TableCell>
                                                    <TableCell style={{ fontSize: "13px" }}>{studentsReceipt.studentName}</TableCell>
                                                    <TableCell style={{ fontSize: "13px" }}>Cash-In</TableCell>
                                                    <TableCell style={{ fontSize: "13px" }}>{studentsReceipt.paymentType}</TableCell>
                                                    <TableCell style={{ fontSize: "13px" }}>{studentsReceipt.paidAmount}</TableCell>
                                                    <TableCell style={{ fontSize: "13px" }}>{studentsReceipt.remainingAmount}</TableCell>
                                                    <TableCell style={{ fontSize: "13px" }}>{studentsReceipt.billDate}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Display Receipt">
                                                            <Button onClick={() => handleDisplayModalOpen(studentsReceipt)}>
                                                                <VisibilityIcon style={{ color: "#9a9a9a" }} />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <Button onClick={() => handleDeleteClick(studentsReceipt)}>
                                                                <DeleteIcon style={{ color: "#9a9a9a" }} />
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Pagination count={Math.ceil(filteredStudents.length / studentsPerPage)} page={page} onChange={handlePageChange} style={{ marginBottom: "2rem" }} />
                    </div>
                </div>
            )}
            {cashInPerson === "customer" && (
                <CustomerTable />
            )}

            {
                isWarningModalOpen && (
                    <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Delete {studentFirstName}'s Receipt ?</h3>
                            <p className="warningText">You will not be able to recover the student details.</p>
                            <div className="buttonsContainer">
                                <button onClick={() => confirmDelete(fieldToDelete)} className="deleteButton">Delete</button>
                                <button onClick={handleCancel} className="cancelButton">Cancel</button>
                            </div>
                        </div>
                    </WarningModal>
                )
            }
            {
                showModal && (
                    <DetailsModal isOpen={showModal} onClose={handleCancel} fieldToShow={fieldToDelete}>
                        <div className="view-modal-container">
                            <h1>Cash In</h1>
                            <div className="modal-flex" style={{ border: "1px solid rgba(159, 159, 159, 0.497)" }}>
                                <div className="left-container">
                                    <p>Student Name</p>
                                    <p>Bill Date</p>
                                    <p>Payment Method</p>
                                    {
                                        selectedStudent.paymentType === "bank" && (
                                            <p>Bank Name</p>
                                        )
                                    }
                                    {
                                        selectedStudent.paymentType === "bank" && (
                                            <p>Bank Payment Type</p>
                                        )
                                    }
                                    {
                                        selectedStudent.bankPaymentType === "CHEQUE" && (
                                            <p>Cheque Number</p>
                                        )
                                    }
                                    {
                                        selectedStudent.paymentType === "onlinePay" && (
                                            <p>Online Payment Gateway</p>
                                        )
                                    }
                                    <p>Previous Balance</p>
                                    <p>Paid Amount</p>
                                    <p>Remaining Balance</p>
                                    {
                                        selectedStudent.comments && (
                                            <p>Comments</p>
                                        )
                                    }
                                </div>
                                <div className="right-container">
                                    <p>{selectedStudent.studentName}</p>
                                    <p>{selectedStudent.billDate}</p>
                                    <p>{selectedStudent.paymentType.charAt(0).toUpperCase() + selectedStudent.paymentType.slice(1)}</p>
                                    {
                                        selectedStudent.paymentType === "bank" && (
                                            <p>{selectedStudent.bankName}</p>
                                        )
                                    }
                                    {
                                        selectedStudent.paymentType === "bank" && (
                                            <p>{selectedStudent.bankPaymentType}</p>
                                        )
                                    }
                                    {
                                        selectedStudent.paymentType === "onlinePay" && (
                                            <p>{selectedStudent.onlinePaymentGateway}</p>
                                        )
                                    }
                                    {
                                        selectedStudent.bankPaymentType === "CHEQUE" && (
                                            <p>{selectedStudent.chequeNumber}</p>
                                        )
                                    }
                                    <p>{selectedStudent.currentBalance}</p>
                                    <p>{selectedStudent.paidAmount}</p>
                                    <p>{selectedStudent.remainingAmount}</p>
                                    {
                                        selectedStudent.comments && (
                                            <p>{selectedStudent.comments}</p>
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

export default Cashin;
