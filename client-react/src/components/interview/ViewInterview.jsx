/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Paper } from '@mui/material';
import { styled } from '@mui/system';
import CustomModal from '../leads/CustomModal';
import WarningModal from '../master/WarningModal';
import warningImage from "../master/assets/exclamation-mark.png"
import EventIcon from '@mui/icons-material/Event';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchInterviews, updateInterview, deleteInterview } from '../features/interviewSlice';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import Select from 'react-select';
import Pagination from '@mui/material/Pagination'

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
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
const followUpdatesOptions = [
    { value: 'Interviewed', label: 'Interviewed' },
    { value: 'Not Interviewed', label: 'Not Interviewed' },
    { value: 'Call Back', label: 'Call Back' },
    { value: 'No Response', label: 'No Response' },
    { value: 'Call Done', label: 'Call Done' }
];
const ViewInterview = () => {

    const dispatch = useDispatch();
    const [person, setPerson] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isPrint, setIsPrint] = useState(false);
    const [page, setPage] = useState(1);
    const studentsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedLeads, setSortedLeads] = useState([]);
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dispatch(fetchInterviews());
                setPerson(data.payload);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };
        fetchData();
    }, [dispatch]);
    useEffect(() => {
        sortLeadsByScheduledDate();
    }, [person, sortOrder]);
    const getStatusColor = (status) => {
        switch (status) {
            case 'Call Done':
                return 'orange';
            case 'Not Interviewed':
                return 'red';
            case 'Call Back':
                return '#0090dd';
            case 'Interviewed':
                return '#1fd655';
            case 'No Response':
                return '#967bb6';
            default:
                return '';
        }
    };
    const handleEditClick = (person) => {
        const editedPerson = {
            ...person,
            investicatedDate: formatDateReverse(person.investicatedDate),
            scheduledDate: formatDateReverse(person.scheduledDate)
        };
        setSelectedPerson(editedPerson);
        // console.log(editedPerson);
        setIsEdit(true);
    };

    const handleDeleteClick = (person) => {
        setSelectedPerson(person);
        setIsDelete(true);
    }

    const handleCancel = () => {
        setIsEdit(false);
        setIsDelete(false);
    }
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Change the format of the investicatedDate and scheduledDate properties before dispatching
            const updatedInvesticatedDate = formatDate(selectedPerson.investicatedDate);
            const updatedScheduledDate = formatDate(selectedPerson.scheduledDate);
            const updatedPerson = {
                ...selectedPerson,
                investicatedDate: updatedInvesticatedDate,
                scheduledDate: updatedScheduledDate
            };

            await dispatch(updateInterview({ id: selectedPerson._id, data: updatedPerson }));
            console.log("Interview updated successfully");
            setIsEdit(false);
            window.location.reload();
        } catch (error) {
            console.error("Error updating interview:", error);
            alert("Error updating interview");
        }
    };
    function formatDate(dateString) {
        const parts = dateString.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return formattedDate;
    }

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setSelectedPerson(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }
    const confirmDelete = async (selectedLead) => {
        try {
            if (selectedLead && selectedLead._id) {
                await dispatch(deleteInterview(selectedLead._id));
                setPerson(prevLeads => prevLeads.filter(lead => lead._id !== selectedLead._id));
                setIsDelete(false);
                // alert("Lead deleted successfully");
                window.location.reload();
            }
        } catch (error) {
            // console.error('Error deleting lead:', error);
            alert("Error deleting lead");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            sortLeadsByScheduledDate();
        }, 24 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);
    const sortLeadsByScheduledDate = () => {
        if (Array.isArray(person) && person.length > 0) {
            const today = new Date();
            const currentYear = today.getFullYear();
            const sortedData = [...person].sort((a, b) => {
                const datePartsA = a.scheduledDate.split('-');
                const datePartsB = b.scheduledDate.split('-');

                const dateA = new Date(datePartsA[2], datePartsA[1] - 1, datePartsA[0]);
                const dateB = new Date(datePartsB[2], datePartsB[1] - 1, datePartsB[0]);
                if (dateA.getFullYear() === currentYear && dateB.getFullYear() === currentYear) {
                    if (dateA >= today && dateB >= today) {
                        return dateA - dateB;
                    }
                    else if (dateA >= today) {
                        return -1;
                    } else if (dateB >= today) {
                        return 1;
                    }
                }
                return dateB - dateA;
            });
            // console.log(sortedData);
            setSortedLeads(sortedData);
        }
    };




    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        if (searchValue === "") {
            sortLeadsByScheduledDate();
        } else {
            const filteredLeads = sortedLeads.filter((lead) =>
                Object.values(lead).some((value) => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchValue);
                    } else if (Array.isArray(value) && value.length > 0 && typeof value[value.length - 1] === 'string') {
                        return value[value.length - 1].toLowerCase().includes(searchValue);
                    }
                    return false;
                })
            );
            setSortedLeads(filteredLeads);
            setPage(1);
        }
    };


    function formatDateReverse(dateString) {
        const parts = dateString.split('-');
        const year = parts[2];
        const month = parts[1];
        const day = parts[0];
        return `${year}-${month}-${day}`;
    }


    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/add-interview" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <EventIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Schedule
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage Interview</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>

            <div className="table-view">
                <input
                    className="input-table-search"
                    placeholder="Search by Values"
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
                                    <StyledTableCell>#</StyledTableCell>
                                    <Tooltip title="Interview Created On">
                                        <StyledTableCell>Created</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell>Qualif</StyledTableCell>
                                    <Tooltip title="Year Of Passing">
                                        <StyledTableCell>YOP</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>Mobile</StyledTableCell>
                                    <StyledTableCell>Location</StyledTableCell>
                                    <StyledTableCell>Job Role</StyledTableCell>
                                    <StyledTableCell>FolUps</StyledTableCell>
                                    <StyledTableCell onClick={toggleSortOrder}>Scheduled On</StyledTableCell>
                                    <StyledTableCell>Source</StyledTableCell>

                                    <StyledTableCell style={{ display: isPrint ? "none" : "" }}>Actions</StyledTableCell>

                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {sortedLeads.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ padding: '20px 10px', fontSize: "11px" }}>{index + 1}</TableCell>
                                        <TableCell style={{ padding: '0px 10px', width: "60px", fontSize: "11px" }}>{item.investicatedDate}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.intervieweeName}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.qualification}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.yearOfPassing}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.phoneNumber}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.location}</TableCell>
                                        <TableCell style={{ padding: '10 5px', fontSize: "11px" }}>{item.jobRole}</TableCell>
                                        <TableCell style={{ padding: '10 5px', fontSize: "11px" }}>
                                            <span style={{
                                                color: getStatusColor(item.followUpDates[item.followUpDates.length - 1]),
                                                fontSize: "11px", fontWeight: "bold",
                                                borderRadius: "4px"
                                            }}
                                            >{item.followUpDates[item.followUpDates.length - 1]}</span>
                                        </TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>
                                            {(item.scheduledDate)}
                                        </TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.source}</TableCell>

                                        <TableCell className="btn-grp-table" style={{ display: isPrint ? "none" : "flex", flexWrap: "nowrap", width: "80px", justifyContent: "flex-start", padding: '23px 5px' }}>
                                            <Tooltip title="Edit">
                                                <EditIcon className="edit-view-btn" onClick={() => handleEditClick(item)} />
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <DeleteIcon className="delete-view-btn" onClick={() => handleDeleteClick(item)} />
                                            </Tooltip>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>
                {/* Pagination*/}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingBottom: "2rem" }}>
                    <PrevButton
                        onClick={() => handleChangePage(null, page - 1)}
                        disabled={page === 1}
                    >
                        Prev
                    </PrevButton>
                    <ActivePagination
                        count={Math.ceil(sortedLeads.length / studentsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                        hideNextButton
                        hidePrevButton
                    />

                    <NextButton
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={page === Math.ceil(sortedLeads.length / studentsPerPage)}
                    >
                        Next
                    </NextButton>
                </div>
                <WarningModal isOpen={isDelete} onClose={handleCancel}>
                    <div className="modalContent">
                        <img src={warningImage} alt="Warning" className="warningImage" />
                        <h3>Delete the Lead?</h3>
                        <p className="warningText">You will not be able to recover the lead</p>
                        <p style={{ padding: "0", margin: "0", paddingTop: ".5rem" }}>{selectedPerson ? selectedPerson.intervieweeName : ''}</p>

                        <div className="buttonsContainer">
                            <button onClick={() => confirmDelete(selectedPerson)} className="deleteButton">Delete</button>
                            <button onClick={handleCancel} className="cancelButton">Cancel</button>
                        </div>
                    </div>
                </WarningModal>

                <CustomModal isOpen={isEdit} selectedLead={selectedPerson} onClose={() => setIsEdit(false)} style={{ maxHeight: "700px", overflowY: "auto" }}>
                    <div className="add-student_container" style={{ margin: "0", padding: "0" }}>
                        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h1>Update Interview</h1>
                            </div>
                            <div>
                                <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                            </div>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className='studentForm' style={{ border: "1px solid rgba(159, 159, 159, 0.497)", borderRadius: "4px", padding: "1rem", margin: "0" }}>
                            <div className="form-group">
                                <label htmlFor="investicatedDate">Date:</label>
                                <input
                                    type="date"
                                    id="investicatedDate"
                                    name="investicatedDate"
                                    value={selectedPerson && selectedPerson.investicatedDate}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="intervieweeName">Interviewee Name:</label>
                                <input
                                    type="text"
                                    id="intervieweeName"
                                    name="intervieweeName"
                                    value={selectedPerson && selectedPerson.intervieweeName}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={selectedPerson && selectedPerson.email}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number:</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={selectedPerson && selectedPerson.phoneNumber}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="qualification">Qualification:</label>
                                <input
                                    type="text"
                                    id="qualification"
                                    name="qualification"
                                    value={selectedPerson && selectedPerson.qualification}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="yearOfPassing">Year of Passing:</label>
                                <input
                                    type="text"
                                    id="yearOfPassing"
                                    name="yearOfPassing"
                                    value={selectedPerson && selectedPerson.yearOfPassing}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={selectedPerson && selectedPerson.location}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="FollowUpdates">Follow Updates:</label>
                                <Select
                                    id="FollowUpdates"
                                    name="FollowUpdates"
                                    options={followUpdatesOptions}
                                    value={selectedPerson && selectedPerson.followUpDates.map(status => ({
                                        value: status,
                                        label: status
                                    }))}
                                    onChange={(selectedOptions) => {
                                        const updatedPerson = {
                                            ...selectedPerson,
                                            followUpDates: selectedOptions.map(option => option.value) || []
                                        };
                                        setSelectedPerson(updatedPerson);
                                    }}
                                    placeholder="Select Recent Follow Update"
                                    isSearchable={true}
                                    isMulti
                                    styles={{
                                        container: provided => ({
                                            ...provided,
                                            width: "100%"
                                        }),
                                        valueContainer: provided => ({ ...provided, textAlign: "left" }),
                                        menu: provided => ({ ...provided, textAlign: "left" }),
                                        option: provided => ({ ...provided, textAlign: "left" })
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="scheduledDate">Scheduled Date:</label>
                                <input
                                    type="date"
                                    id="scheduledDate"
                                    name="scheduledDate"
                                    value={selectedPerson && selectedPerson.scheduledDate}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="jobRole">Job Role:</label>
                                <input
                                    type="text"
                                    id="jobRole"
                                    name="jobRole"
                                    value={selectedPerson && selectedPerson.jobRole}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="source">Source:</label>
                                <input
                                    type="text"
                                    id="source"
                                    name="source"
                                    value={selectedPerson && selectedPerson.source}
                                    onChange={handleInputChanges}
                                    required
                                />
                            </div>
                            <div className="full-width">
                                <div className="btn-submit">
                                    <button type="submit">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </CustomModal>
            </div>
        </div>
    )
}

export default ViewInterview
