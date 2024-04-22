/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStudentReceipts, deleteReceipt } from '../features/studentReceiptSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tooltip, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import logoKitkat from "../../navigationbar/assets/kitkat-removebg-preview.png"
import jsPDF from "jspdf";
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
    const studentsPerPage = 10;
    const indexOfLastStudent = page * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const handleChangePage = (event, value) => {
        setPage(value);
    };

    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [studentFirstName, setStudentFirstName] = useState('');
    // modal
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        dispatch(getStudentReceipts());
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
        // console.log(student, "clicked");
    };
    const handleCashInPersonChange = (e) => {
        const newValue = e.target.value;
        setCashInPerson(newValue);
        localStorage.setItem('cashInPerson', newValue);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // console.log(searchTerm);
    };
    const handleDeleteClick = (student) => {
        if (student && student._id) {
            setFieldToDelete(student._id);
            setStudentFirstName(student.studentName);
            console.log(student, "DeleteHandle", fieldToDelete, studentFirstName);
            setIsWarningModalOpen(true);
        } else {
            console.error("Invalid student object:", student);
        }
    };
    const handleCancel = () => {
        setIsWarningModalOpen(false);
        setShowModal(false);
    };
    const confirmDelete = async (fieldToDelete) => {
        console.log(fieldToDelete, "Confirm Field 1");
        try {
            const selectedStudent = studentsReceipt.find(student => student._id === fieldToDelete);
            console.log("SelectedStudent:", selectedStudent);

            if (!selectedStudent) {
                throw new Error("Selected student not found");
            }

            await dispatch(deleteReceipt(fieldToDelete));
            setIsWarningModalOpen(false);

            window.location.reload();
        } catch (error) {
            console.error('Error confirming delete:', error);
        }
    };
    const handlePdfDownload = (student) => {
        const { studentName, paymentType, paidAmount, remainingAmount, billDate, course, duration } = student;

        // Create new jsPDF instance with A5 format
        const doc = new jsPDF({
            format: 'a5',
            orientation: 'portrait',
            unit: 'mm',  // set measurement unit to millimeters
        });

        // Set the desired width for the title columns
        const titleWidth = 25;

        // Set the padding and border color
        const padding = 10;
        const borderColor = '#808080';

        // Add border around the content
        const contentWidth = doc.internal.pageSize.width - 2 * padding;
        const contentHeight = doc.internal.pageSize.height - 2 * padding;
        doc.setDrawColor(borderColor);
        doc.rect(padding, padding, contentWidth, contentHeight);

        // Add logo aligned left with padding
        const logoImg = logoKitkat; // Replace with the path to your logo image
        const logoWidth = 40;
        const logoHeight = 20;
        const logoPadding = 5;
        doc.addImage(logoImg, 'PNG', padding + logoPadding, padding + logoPadding, logoWidth, logoHeight);

        // Add two break spaces
        const breakSpaceHeight = 5; // Adjust as needed
        doc.text('', padding + logoPadding, padding + logoPadding + logoHeight + padding + breakSpaceHeight);

        // Add "Student Receipt" aligned right next to the logo with bold text
        const textRightMargin = doc.internal.pageSize.width - padding - logoPadding;
        const textYPosition = padding + logoPadding + logoHeight / 2;
        doc.setFontSize(12); // Set font size for titles
        doc.setFont('bold'); // Set font to bold
        doc.text('INTERNSHIP ACKNOWLEDGEMENT', textRightMargin, textYPosition, { align: 'right' });

        // Reset font to normal
        doc.setFont('normal');

        // Add titles with specified width below the logo
        const titleYPosition = padding + logoPadding + logoHeight + 2 * padding + breakSpaceHeight;
        doc.setFontSize(12); // Set font size for titles
        doc.text('Student Name:', padding + logoPadding, titleYPosition);
        doc.text('Course:', padding + logoPadding, titleYPosition + 10);
        doc.text('Duration:', padding + logoPadding, titleYPosition + 20);
        doc.text('Payment Type:', padding + logoPadding, titleYPosition + 30);
        doc.text('Paying Amount:', padding + logoPadding, titleYPosition + 40);
        doc.text('Balance Amount:', padding + logoPadding, titleYPosition + 50);
        doc.text('Receipt Date:', padding + logoPadding, titleYPosition + 60);

        // Add student data with specified width and left-aligned below the titles
        const dataYPosition = padding + logoPadding + logoHeight + 2 * padding + breakSpaceHeight;
        const dataXPosition = padding + logoPadding + titleWidth + 5;
        doc.setFontSize(12); // Set font size for data values
        doc.text(studentName, dataXPosition, dataYPosition);
        doc.text(course, dataXPosition, dataYPosition + 10);
        doc.text(duration, dataXPosition, dataYPosition + 20);
        doc.text(paymentType, dataXPosition, dataYPosition + 30);
        doc.text(paidAmount.toString(), dataXPosition, dataYPosition + 40);
        doc.text(remainingAmount.toString(), dataXPosition, dataYPosition + 50);
        doc.text(billDate, dataXPosition, dataYPosition + 60);

        // Add "NOTE: Amount Cannot Be Refund" below the student data
        const noteYPosition = padding + logoPadding + logoHeight + 1.5 * padding + 80;
        doc.text('NOTE: Amount Cannot Be Refund', padding + logoPadding, noteYPosition);

        // Add HR Signature
        const signatureYPosition = noteYPosition + 2 * padding;
        doc.text('HR Signature', padding + logoPadding, signatureYPosition);

        // Save the PDF
        doc.save(`${studentName}StudentReceipt.pdf`);
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
                                                    <TableCell align="center">
                                                        <Tooltip title="Display Receipt">
                                                            <VisibilityIcon className="display-view-btn" onClick={() => handleDisplayModalOpen(studentsReceipt)} />
                                                        </Tooltip>
                                                        <Tooltip title="Download PDF">
                                                            <PictureAsPdfIcon className="pdf-download-btn" onClick={() => handlePdfDownload(studentsReceipt)} />
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <DeleteIcon className="delete-view-btn" onClick={() => handleDeleteClick(studentsReceipt)} />
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
                            count={Math.ceil(studentsReceipt.length / studentsPerPage)}
                            page={page}
                            onChange={handleChangePage}
                            variant="outlined"
                            shape="rounded"
                            hideNextButton
                            hidePrevButton
                        />
                        <NextButton
                            onClick={() => handleChangePage(null, page + 1)}
                            disabled={page === Math.ceil(studentsReceipt.length / studentsPerPage)}
                        >
                            Next
                        </NextButton>
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
                            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h1>Student Cash In</h1>
                                </div>
                                <div>
                                    <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                                </div>
                            </div>
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
