/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStaffDetails, updateStaffDetail, deleteStaffDetail } from "../features/staffSlice";
import WarningModal from './WarningModal';
import warningSign from "./assets/exclamation-mark.png";


import axios from 'axios';

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});
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

const AllUsers = () => {
    const dispatch = useDispatch();
    const staffDetails = useSelector(state => state.staffDetails.staffDetailEntries);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [fieldToDelete, setFieldToDelete] = useState(null);

    useEffect(() => {
        dispatch(getStaffDetails());
    }, [dispatch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    useEffect(() => {
        fetchData();
    }, [staffDetails]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8011/hrm/user');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleEdit = (staff) => {
        setSelectedAdmin(staff);
        // console.log("Users:", users);
        const selectedUser = users.filter(user => user.userName === staff.userName);
        setSelectedUser(selectedUser);
        setIsEdit(true);
        // console.log("Edit clicked for staff:", staff);
    };

    const handleDelete = (staff) => {
        setSelectedAdmin(staff);
        const selectedUser = users.filter(user => user.userName === staff.userName);
        setSelectedUser(selectedUser);
        setFieldToDelete(selectedUser);
        // console.log("Delete--", selectedUser);
        setIsDelete(true);
        // console.log("Delete clicked for staff:", staff);
    };

    const formatDate = (dateString) => {
        const staffDojString = dateString;
        const staffDojDate = new Date(staffDojString);
        const formattedStaffDoj = staffDojDate.toLocaleDateString("en-GB");
        return formattedStaffDoj;
    }
    const handleInputChange = (field, value) => {
        setSelectedAdmin(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleCancel = () => {
        setIsDelete(false);
        setIsEdit(false);
    };
    const confirmDelete = async () => {
        try {
            if (selectedAdmin && selectedAdmin._id) {
                // console.log("Selected Admin:", selectedAdmin, selectedUser);
                if (selectedUser && selectedUser.length > 0 && selectedUser[0]._id) {
                    const selectedUserId = selectedUser[0]._id;
                    // console.log("Selected User ID:", selectedUserId);
                    await Promise.all([
                        dispatch(deleteStaffDetail(selectedAdmin._id)),
                        axios.delete(`http://localhost:8011/hrm/deleteUser/${selectedUserId}`),
                    ]);
                    setIsDelete(false);
                    window.location.reload();
                } else {
                    console.error("User not found or missing required fields.");
                }
            }
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };


    const confirmEdit = async () => {
        try {
            if (selectedAdmin && selectedAdmin._id) {
                // console.log("Selected Admin:", selectedAdmin, selectedUser);
                if (selectedUser && selectedUser.length > 0 && selectedUser[0]._id) {
                    const updatedData = {
                        userName: selectedAdmin.userName,
                        password: selectedAdmin.password,
                        staffName: selectedAdmin.staffName,
                        staffDoj: selectedAdmin.staffDoj
                    };
                    const updatedAdmin = {
                        userName: selectedAdmin.userName,
                        password: selectedAdmin.password,
                    }

                    await Promise.all([
                        dispatch(updateStaffDetail({ id: selectedAdmin._id, updatedData })),
                        axios.put(`http://localhost:8011/hrm/updateUser/${selectedUser[0]._id}`, updatedAdmin)
                    ]);
                    localStorage.setItem("user", JSON.stringify({ ...updatedAdmin, userName: selectedAdmin.userName }));

                    setIsEdit(false);
                    window.location.reload();
                } else {
                    console.error("User not found or missing required fields.");
                }
            }
        } catch (error) {
            console.error("Error updating staff:", error);
        }
    };




    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/add_staff" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Admin
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Admins</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="table-container" style={{ padding: "1.5rem", borderBottom: "1px solid transparent" }}>
                <TableContainer component={Paper} style={{ overflow: 'auto' }}>
                    <Table>
                        <StyledTableHead>
                            <TableRow>
                                <StyledTableCell>#</StyledTableCell>
                                <StyledTableCell>Admin Name</StyledTableCell>
                                <StyledTableCell>DOJ</StyledTableCell>
                                <StyledTableCell>User Name</StyledTableCell>
                                <StyledTableCell>Password</StyledTableCell>
                                <StyledTableCell style={{ width: 100 }}>Action</StyledTableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? staffDetails.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                                : staffDetails
                            ).map((staff, index) => (
                                <TableRow key={staff._id}>
                                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{staff.staffName}</TableCell>
                                    <TableCell>{formatDate(staff.staffDoj)}</TableCell>
                                    <TableCell>{staff.userName}</TableCell>
                                    <TableCell>{staff.password}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <EditIcon className="edit-view-btn" onClick={() => handleEdit(staff)} />
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <DeleteIcon className="delete-view-btn" onClick={() => handleDelete(staff)} />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingBottom: "2rem", paddingRight: "1rem" }}>
                <PrevButton
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 1}
                >
                    Prev
                </PrevButton>
                <ActivePagination
                    count={Math.ceil(staffDetails.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    hideNextButton
                    hidePrevButton
                />

                <NextButton
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page === Math.ceil(staffDetails.length / rowsPerPage)}
                >
                    Next
                </NextButton>
            </div>
            {isEdit && (
                <WarningModal isOpen={isEdit} onClose={handleCancel} selectedAdmin={selectedAdmin}>
                    <div className="modalContent">
                        <h3>Edit the Course</h3>
                        <div className="input-container">
                            <label htmlFor="userName">User Name:</label>
                            <input
                                name="userName"
                                type="text"
                                value={selectedAdmin.userName}
                                onChange={(e) => handleInputChange('userName', e.target.value)}
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Password:</label>
                            <input
                                name="password"
                                type="text"
                                value={selectedAdmin.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Enter password"
                            />
                        </div>

                        <div className="buttonsContainer">
                            <button onClick={confirmEdit} className="editButton-blue">Edit</button>
                            <button onClick={handleCancel} className="cancelButton-blue">Cancel</button>
                        </div>
                    </div>
                </WarningModal>
            )}
            {
                isDelete && (
                    <WarningModal isOpen={isDelete} onClose={handleCancel} selectedUser={selectedUser}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Delete {selectedUser.userName} as Admin?</h3>
                            <p className="warningText">You will not be able to recover the admin details.</p>
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
}

export default AllUsers;
