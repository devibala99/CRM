// export default ReschedulesTable;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from "axios";
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { Edit as EditIcon } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination'
import LeadFollowUpModal from './LeadFollowUpModal';
import Select from 'react-select';

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
    { value: 'Interested', label: 'Interested' },
    { value: 'Not Interested', label: 'Not Interested' },
    { value: 'Call Back', label: 'Call Back' },
    { value: 'No Response', label: 'No Response' },
    { value: 'Call Done', label: 'Call Done' }
];

const StyledTableContainer = styled(TableContainer)({
    overflowX: 'auto',
});

const ReschedulesTable = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState({});
    useEffect(() => {
        fetchData();
    }, []);
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            const result = (await axios.get("http://localhost:8011/excelData/")).data;
            console.log(result, "get");
            setLeads(result);
        } catch (error) {
            setLoading(false);
        }
    }
    const handleCancel = () => {
        setShowEditModal(false);
    }
    const handleInputChangeLeads = (event) => {
        const { name, value } = event.target;

        if (selectedLead.Rescheduled === undefined) {
            setSelectedLead(prevSelectedLead => ({
                ...prevSelectedLead,
                Rescheduled: ""
            }));
        }
        setSelectedLead(prevSelectedLead => ({
            ...prevSelectedLead,

            [name]: value

        }));
    }

    const handleLeadsSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const updatedLead = {
                DateCol: selectedLead.DateCol,
                Name: selectedLead.Name,
                Qualification: selectedLead.Qualification,
                YearOfPassing: selectedLead.YearOfPassing,
                PhoneNumber: selectedLead.PhoneNumber,
                FollowUpdates: selectedLead.FollowUpdates,
                Source: selectedLead.Source,
                Location: selectedLead.Location,
                FollowupPerson: selectedLead.FollowupPerson,
                DetailsSent: selectedLead.DetailsSent,
                Rescheduled: selectedLead.Rescheduled,
                Course: selectedLead.Course,
            };
            console.log(updatedLead);
            await axios.put(`http://localhost:8011/excelData/update_excelFile/${selectedLead._id}`, updatedLead);
            setLeads(prevLeads => prevLeads.map(lead => lead._id === selectedLead._id ? updatedLead : lead));
            setSelectedLead({});
            alert('Lead updated successfully');
            setShowEditModal(false);
            window.location.reload();

            setLoading(false);
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Error updating lead. Please try again.');
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2); // Extract last two digits of the year
        return `${day}-${month}-${year}`;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Call Done':
                return '#FFA500';
            case 'Not Interested':
                return 'red';
            case 'Call Back':
                return '#0090dd';
            case 'Interested':
                return '#1fd655';
            case 'No Response':
                return '#967bb6';
            default:
                return '';
        }
    };

    // Filter and sort the leads array
    const filteredAndSortedLeads = leads
        .filter(lead => lead.Rescheduled !== "")
        .sort((a, b) => new Date(b.Rescheduled) - new Date(a.Rescheduled));

    // Pagination
    const studentsPerPage = 10;
    const indexOfLastStudent = page * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredAndSortedLeads.slice(indexOfFirstStudent, indexOfLastStudent);

    const handleEditClick = (lead) => {
        setSelectedLead(lead);
        console.log(selectedLead, "selectedLead");
        setShowEditModal(true);
    }
    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/excel-leads" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Leads
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Rescheduled Leads</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="table-view" style={{ paddingTop: "2rem" }}>
                <div className="table-container">
                    <StyledTableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <StyledTableCell>#</StyledTableCell>
                                    <Tooltip title="Lead Created On">
                                        <StyledTableCell>Created</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell>Qualif</StyledTableCell>
                                    <Tooltip title="Year Of Passing">
                                        <StyledTableCell>YOP</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>Mobile</StyledTableCell>
                                    <StyledTableCell>Location</StyledTableCell>
                                    <StyledTableCell>Course</StyledTableCell>
                                    <StyledTableCell>FolUps</StyledTableCell>
                                    <Tooltip title="Course Detail Sent">
                                        <StyledTableCell>Sent</StyledTableCell>
                                    </Tooltip>
                                    <Tooltip title="Rescheduled">
                                        <StyledTableCell>Reschd</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>Assignee</StyledTableCell>
                                    <StyledTableCell>Source</StyledTableCell>
                                    <StyledTableCell>Edit</StyledTableCell>

                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {currentStudents.map((lead, index) => (
                                    <TableRow key={index} style={{ backgroundColor: index % 2 === 1 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                        <TableCell style={{ fontSize: "11px" }}>{index + 1}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{formatDate(lead.DateCol)}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.Name}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.Qualification}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.YearOfPassing}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.PhoneNumber}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.Location}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.Course}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>
                                            <span style={{
                                                color: getStatusColor(lead.FollowUpdates && lead.FollowUpdates[lead.FollowUpdates.length - 1]),
                                                fontSize: "11px", fontWeight: "bold",
                                                borderRadius: "4px"
                                            }}
                                            >{lead.FollowUpdates && lead.FollowUpdates[lead.FollowUpdates.length - 1]}</span>
                                        </TableCell>                                        <TableCell style={{ fontSize: "11px" }}>{lead.DetailsSent}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{formatDate(lead.Rescheduled)}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.FollowupPerson}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>{lead.Source}</TableCell>
                                        <TableCell style={{ fontSize: "11px" }}>
                                            <EditIcon className="edit-view-btn" onClick={() => handleEditClick(lead)} />
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
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
                    count={Math.ceil(currentStudents.length / studentsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    hideNextButton
                    hidePrevButton
                />

                <NextButton
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page === Math.ceil(currentStudents.length / studentsPerPage)}
                >
                    Next
                </NextButton>
            </div>

            <LeadFollowUpModal isOpen={showEditModal} selectedLead={selectedLead} onClose={() => setShowEditModal(false)} style={{ border: "none" }}>
                <div className="add-student_container" style={{ margin: "0", padding: "0" }}>
                    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center", padding: "0", margin: "0" }}>
                        <div>
                            <h1>Update</h1>
                        </div>
                        <div>
                            <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                        </div>
                    </div>
                    <form onSubmit={handleLeadsSubmit} className='studentForm' style={{
                        border: "1px solid rgba(159, 159, 159, 0.497)", borderRadius: "4px", padding: "1rem", margin: "0",
                        display: "flex", flexDirection: "column"
                    }}>
                        <div className="form-group" style={{ width: "100%" }}>
                            <label htmlFor="FollowUpdates">Update Follow Ups:</label>

                            <Select
                                id="FollowUpdates"
                                name="FollowUpdates"
                                options={followUpdatesOptions}
                                value={selectedLead.FollowUpdates && selectedLead.FollowUpdates.map(status => ({
                                    value: status,
                                    label: status
                                }))}
                                onChange={(selectedOptions) => setSelectedLead(prevState => ({ ...prevState, FollowUpdates: selectedOptions.map(option => option.value) }))}
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
                        <div className="form-group" style={{ width: "100%" }}>
                            <label htmlFor="Rescheduled">Rescheduled:</label>
                            <input
                                type="date"
                                id="Rescheduled"
                                name="Rescheduled"
                                value={selectedLead.Rescheduled}
                                onChange={handleInputChangeLeads}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="full-width">
                            <div className="btn-submit">
                                <button type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </LeadFollowUpModal>
        </div>
    );
}

export default ReschedulesTable;
