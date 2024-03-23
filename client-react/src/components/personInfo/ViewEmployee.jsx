/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showEmployees, deleteEmployee, updateEmployee } from '../features/employeesSlice';
import { Table, TableBody, TableCell, TableContainer, Tooltip, TableHead, TableRow, Paper, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import "./viewTable.css"
import { Link } from 'react-router-dom';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import DisplayEmployeeModal from './DisplayEmployeeModal';
import EditEmployeeEdit from './EditEmployeeEdit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",

});
const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});


const ViewEmployee = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const employees = useSelector(state => state.employees.employeeEntries);

    const dispatch = useDispatch();

    // Pagination
    const employeesPerPage = 5;
    const indexOfLastEmployee = page * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    useEffect(() => {
        dispatch(showEmployees());
    }, [dispatch]);

    useEffect(() => {
        // Filter Employees based on search term
        const filtered = employees.filter(employee =>
            employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [employees, searchTerm]);

    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [employeeFirstName, setEmployeeFirstName] = useState('');
    const [employeeLastName, setEmployeeLastName] = useState('');

    const handleDeleteClick = (employee) => {
        setIsWarningModalOpen(true);
        console.log(employee.id);
        setFieldToDelete(employee.id);
        setEmployeeFirstName(employee.firstName);
        setEmployeeLastName(employee.lastName);
    };
    const handleCancel = () => {
        setIsWarningModalOpen(false);
    };
    const confirmDelete = (fieldToDelete) => {
        console.log(`Deleting field with ID: ${fieldToDelete}`);
        dispatch(deleteEmployee(fieldToDelete));
        setIsWarningModalOpen(false);
        window.location.reload();
    };

    // const handleDelete = (id) => {
    //     dispatch(deleteEmployee(id))
    //         .then((res) => {
    //             if (res.payload && res.payload.message === 'Employee deleted successfully') {
    //                 setPopupMessage('Employee deleted successfully');
    //                 setShowPopup(true);
    //                 setFilteredEmployees(prevFilteredEmployees => prevFilteredEmployees.filter(employee => employee.id !== id));
    //                 setTimeout(() => {
    //                     setShowPopup(false);
    //                 }, 3000);
    //             } else {
    //                 setPopupMessage('Internal Error Occurred');
    //                 setShowPopup(true);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error deleting employee:', error);
    //             setPopupMessage('Internal Error Occurred');
    //             setShowPopup(true);
    //         });
    // };
    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleDisplayModalOpen = (employee) => {
        setSelectedEmployee(employee);
        setDisplayModalOpen(true);
        console.log(employee, "clicked");
    };
    const handleDisplayModalClose = () => {
        setDisplayModalOpen(false);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setModalOpen(true);

    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // setSearchTerm(searchTerm);
        // filterEmployees(searchTerm);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const dateFormation = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleUpdate = (updatedEmployeeData) => {
        dispatch(updateEmployee(updatedEmployeeData));
    };
    return (
        <div className='employee-view-container'>

            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/new-employee/:employeeId"
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Employee
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Manage Employees Data</h2>
                    <SidebarBreadcrumbs />
                </div>

            </div>
            {
                modalOpen && selectedEmployee && (
                    <EditEmployeeEdit
                        selectedEmployee={selectedEmployee}
                        modalOpen={modalOpen}
                        onClose={handleCloseModal}
                    />
                )
            }
            <div className="table-view">

                <input
                    className="input-table-search"
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ padding: "12px", fontSize: "1rem", border: "1px solid rgba(159, 159, 159, 0.497)" }}
                />
                <div className="table-container" style={{ overflowX: 'auto' }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow >
                                    <StyledTableCell>S.No</StyledTableCell>
                                    <StyledTableCell>ID</StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell>DOB</StyledTableCell>
                                    <StyledTableCell>Email</StyledTableCell>
                                    <StyledTableCell>Contact</StyledTableCell>
                                    <StyledTableCell>Teaching</StyledTableCell>
                                    <StyledTableCell>Designation</StyledTableCell>
                                    <StyledTableCell>Salary</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>

                            {currentEmployees.length === 0 ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            No employees found. Add employees.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {currentEmployees.map((employee, index) => (
                                        <TableRow key={employee.id} style={{ backgroundColor: index % 2 === 1 ? "#f1f1f1af" : "transparent", height: "0.5rem" }}>
                                            <TableCell style={{ fontSize: "13px" }}>{index + 1}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.employeeId}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.firstName} {employee.lastName}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{dateFormation(employee.dateOfBirth)}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.emailId}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.contactNumber1}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.isStaff}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.designation}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{employee.salary}</TableCell>
                                            <TableCell className='btn-grp-table'>
                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <Tooltip title="Edit">
                                                        <EditIcon className="edit-view-btn" onClick={() => handleEdit(employee)} />
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteIcon className="delete-view-btn" onClick={() => handleDeleteClick(employee)} />
                                                    </Tooltip>
                                                    <Tooltip title="Display employee">
                                                        <VisibilityIcon className="display-view-btn" onClick={() => handleDisplayModalOpen(employee)} />
                                                    </Tooltip>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Pagination count={Math.ceil(filteredEmployees.length / employeesPerPage)} page={page} onChange={handlePageChange} style={{ marginBottom: "2rem" }} />
            </div>

            {selectedEmployee && (
                <DisplayEmployeeModal
                    displayModalOpen={displayModalOpen}
                    selectedEmployee={selectedEmployee}
                    onClose={handleDisplayModalClose}
                    onUpdate={handleUpdate}
                />
            )}

            {
                isWarningModalOpen && (
                    <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Delete Employee {employeeFirstName} {employeeLastName} ?</h3>
                            <p className="warningText">You will not be able to recover the employee details.</p>
                            <div className="buttonsContainer">
                                <button onClick={() => confirmDelete(fieldToDelete)} className="deleteButton">Delete</button>
                                <button onClick={handleCancel} className="cancelButton">Cancel</button>
                            </div>
                        </div>
                    </WarningModal>
                )
            }

        </div>
    );
};

export default ViewEmployee;
