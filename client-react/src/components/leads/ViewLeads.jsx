/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip, Paper } from '@mui/material';
import { styled } from '@mui/system';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WarningModal from '../master/WarningModal';
import warningImage from "../master/assets/exclamation-mark.png"
import { getLeadDetails, deleteLeadDetail, updateLeadDetail } from '../features/leadSlice';
import Pagination from '@mui/material/Pagination';
import "./leads.css"
import "./datePicker.css"
import FilterListIcon from '@mui/icons-material/FilterList';
import Select from 'react-select';
import ActionMenu from './ActionMenu';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from './CustomModal';
import { Call as CallIcon, Email as EmailIcon, Message as MessageIcon, MeetingRoom as MeetingIcon } from '@mui/icons-material';
import { industries, leadSources, leadStatusOptions, followUpDateOptions, leadTypeOptions } from './options';
import ViewLeadModal from './ViewLeadModal';

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
const leadTagsOptions = [
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Linkedin', label: 'Linkedin' },
    { value: 'Search Engines (Organic)', label: 'Search Engines (Organic)' },
    { value: 'Search Engines Ads (Paid)', label: 'Search Engines Ads (Paid)' },
    { value: 'Email Marketing', label: 'Email Marketing' },
    { value: 'Referrals', label: 'Referrals' },
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Engaged', label: 'Engaged' },
    { value: 'Appointment Scheduled', label: 'Appointment Scheduled' },
    { value: 'Proposal Sent', label: 'Proposal Sent' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' },
    { value: 'Unqualified', label: 'Unqualified' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Reengagement', label: 'Reengagement' },
    { value: 'Phone Calls', label: 'Phone Calls' },
    { value: 'Emails', label: 'Emails' },
    { value: 'Text-Message', label: 'Text-Message' },
    { value: 'Face to Face meeting', label: 'Face to Face meeting' }
];


const ViewLeads = () => {
    const leads = useSelector(state => state.leadDetails.leadDetailEntries);
    const dispatch = useDispatch();
    const [selectLeadType, setSelectLeadType] = useState(() => localStorage.getItem("SelectedLeadType") || "");
    const [selectedTags, setSelectedTags] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [page, setPage] = useState(1);
    const studentsPerPage = 10;
    const indexOfLastStudent = page * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = leads.slice(indexOfFirstStudent, indexOfLastStudent);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editableLead, setEditableLead] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    // date picker modal
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(getLeadDetails());
    }, [dispatch]);

    const applyFilters = useCallback(() => {
        const filtered = leads.filter(lead => {
            if (selectLeadType !== '') {
                return lead.leadType === selectLeadType;
            }
            return true;
        }).filter(lead => {
            const leadDate = new Date(lead.leadCreatedOn);
            return (!startDate || leadDate >= startDate) && (!endDate || leadDate <= endDate);
        }).filter(lead => {
            if (selectedTags.length === 0) return true;
            return selectedTags.every(tag => lead.tags.includes(tag.value));
        });
        setFilteredLeads(filtered);
    }, [leads, selectLeadType, startDate, endDate, selectedTags]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleSetLeadType = (value) => {
        // const newValue = e.target.value;
        // setSelectLeadType(newValue);
        const leadTypeValue = value !== undefined ? value : '';
        setSelectLeadType(leadTypeValue);
        localStorage.setItem("SelectedLeadType", leadTypeValue);

    }

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const handleViewLead = (lead) => {
        setSelectedLead(lead);
        setViewModal(true);
        console.log(viewModal);
    }
    const handleCloseModal = () => {
        setViewModal(false);
    };


    const handleClick = (lead) => {
        console.log("Click", lead);
    }

    const handleFilterSection = () => {
        setShowSidebar(!showSidebar);
    }

    const handleCloseDropdown = () => {
        setShowSidebar(false);
    }
    const handleEditClick = (lead) => {
        setEditableLead(lead);
        // console.log(lead);
        setSelectedLead(lead);
        setShowEditModal(true);
    };
    const handleUpdateLead = (updatedLead) => {
        dispatch(updateLeadDetail(updatedLead));
        setShowEditModal(false);
    };

    // date range picker functionality

    const handleShortcutClick = (shortcut) => {
        const today = new Date();
        let newStartDate = null;
        let newEndDate = null;

        switch (shortcut) {
            case 'thisWeek':
                newStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
                newEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
                break;
            case 'lastWeek':
                newStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
                newEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay() - 7));
                break;
            case 'today':
                newStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                newEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                break;
            case 'thisMonth':
                newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                newEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'lastMonth':
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                newStartDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
                newEndDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
                break;
            case 'thisYear':
                newStartDate = new Date(today.getFullYear(), 0, 1);
                newEndDate = new Date(today.getFullYear(), 11, 31);
                break;
            case 'lastYear':
                const lastYear = new Date(today.getFullYear() - 1, 0, 1);
                newStartDate = new Date(lastYear.getFullYear(), 0, 1);
                newEndDate = new Date(lastYear.getFullYear(), 11, 31);
                break;
            default:
                break;
        }

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        // console.log(newStartDate, newEndDate);
    };
    const handleApplyFilters = () => {
        applyFilters();
    };
    const handleTagsChange = (selectedOptions) => {
        setSelectedTags(selectedOptions);
        console.log("Selected Tags", selectedTags)
    };
    // open modal
    const handleDeleteClick = (lead) => {
        setSelectedLead(lead);
        setShowWarningModal(true);
        console.log(lead, "LeadDe");
    };

    const handleCloseWarningModal = () => {
        setShowWarningModal(false);
    };

    const confirmDelete = () => {
        if (selectedLead && selectedLead._id) {
            dispatch(deleteLeadDetail(selectedLead._id));
        }
        setShowWarningModal(false);
        // window.location.reload();
    };
    const handleCancel = () => {
        setShowWarningModal(false);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return '#9bedff';
            case 'Closed Lost':
                return '#ffb09c';
            case 'Closed Won':
                return 'lightGreen';
            case 'Appointment Scheduled':
                return '#fffd8d';
            case 'Contacted':
                return '#FAC898';
            case 'Qualified':
                return '#9fdded';
            case 'Engaged':
                return '#90EEBF';
            case 'Proposal Sent':
                return '#91BAD6';
            case 'Negotiation':
                return '#F79DAA';
            case 'Unqualified':
                return '#dec4fc';
            case 'On Hold':
                return '#CBC3E3';
            case 'Reengagement':
                return '#FFB6C1';
            default:
                return '';
        }
    };
    const renderFollowUpIcon = (followUpdate) => {
        switch (followUpdate) {
            case 'Phone Calls':
                return <Tooltip title="Calls"><CallIcon style={{ fontSize: "1.2rem", color: "#9a9a9a", cursor: "pointer" }} /></Tooltip>;
            case 'Emails':
                return <Tooltip title="Calls"><EmailIcon style={{ fontSize: "1.2rem", color: "#9a9a9a", cursor: "pointer" }} /></Tooltip>;;
            case 'Text-Message':
                return <Tooltip title="Calls"><MessageIcon style={{ fontSize: "1.2rem", color: "#9a9a9a", cursor: "pointer" }} /></Tooltip>;
            case 'Face to Face meeting':
                return <Tooltip title="Calls"><MeetingIcon style={{ fontSize: "1.2rem", color: "#9a9a9a", cursor: "pointer" }} /></Tooltip>;
            default:
                return null;
        }
    };

    const handleLeadsSubmit = (e) => {
        e.preventDefault();

        dispatch(updateLeadDetail({ leadId: selectedLead._id, updatedData: selectedLead }))
            .then((response) => {
                console.log("Lead updated successfully:", response);
            })
            .catch((error) => {
                console.error("Error updating lead:", error);
            });
        setEditableLead(false);
        setShowEditModal(false);
    }
    const handleInputChangeLeads = (e) => {
        const { name, value } = e.target;
        setSelectedLead(prevLead => ({
            ...prevLead,
            [name]: value
        }));
    }
    return (
        <div className='student-view-container'>
            {/* Bread Crumb */}
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/create_lead" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Lead
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage Leads</h2>
                    {/* Radio Buttons */}
                    <div className="radio-btn-input" style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                        <div className="form-group">
                            <div className="radio-row-select" style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="all"
                                        name="cashin"
                                        value=""
                                        checked={selectLeadType === ''}
                                        onChange={() => handleSetLeadType('')}
                                    />
                                    <label htmlFor="all">All</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="student"
                                        name="cashin"
                                        value="Student"
                                        checked={selectLeadType === 'Student'}
                                        onChange={() => handleSetLeadType('Student')}
                                    />
                                    <label htmlFor="student">Student</label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        id="customer"
                                        name="cashin"
                                        value="Customer"
                                        checked={selectLeadType === 'Customer'}
                                        onChange={() => handleSetLeadType('Customer')} />
                                    <label htmlFor="customer">Customer</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Filter Section */}
            <div className={`dropdown-container ${showSidebar ? 'open' : ''}`}>
                <div className='date-range_column'>
                    <div className="column-segment">
                        <div className="short-tags">
                            <button onClick={() => handleShortcutClick('today')}>Today</button>
                            <button onClick={() => handleShortcutClick('thisWeek')}>This Week</button>
                            <button onClick={() => handleShortcutClick('lastWeek')}>Last Week</button>
                            <button onClick={() => handleShortcutClick('thisMonth')}>This Month</button>
                            <button onClick={() => handleShortcutClick('lastMonth')}>Last Month</button>
                            <button onClick={() => handleShortcutClick('thisYear')}>This Year</button>
                            <button onClick={() => handleShortcutClick('lastYear')}>Last Year</button>

                        </div>
                        <div className='calendar-inputs'>
                            <div className="individual-date-set">
                                <label htmlFor="fromDate">From:</label>
                                <DatePicker
                                    id="fromDate"
                                    onChange={date => setStartDate(date)}
                                    selected={startDate ? new Date(startDate) : null}
                                    selectsStart
                                    startDate={startDate && new Date(startDate)}
                                    endDate={endDate && new Date(endDate)}
                                    className="custom-datepicker"
                                    placeholderText="Pick Start Date"
                                />

                            </div>
                            <div className="individual-date-set">
                                <label htmlFor="toDate">To:</label>
                                <DatePicker
                                    id="toDate"
                                    onChange={date => setEndDate(date)}
                                    selected={endDate ? new Date(endDate) : null}
                                    selectsEnd
                                    startDate={startDate ? new Date(startDate) : null}
                                    endDate={endDate ? new Date(endDate) : null}
                                    minDate={startDate ? new Date(startDate) : null}
                                    className="custom-datepicker"
                                    placeholderText="Pick End Date"
                                />

                            </div>
                        </div>
                    </div>
                </div>
                {/* Additional filter sections */}
                <div className='filter-section'>
                    {/* Status tags */}
                    <div className='filter-group'>
                        <Tooltip title="Lead Status, Source and Follow Update">
                            <button style={{ width: "120px", backgroundColor: "#d3d3d3", padding: ".5rem", fontSize: "13px", color: "#545453", borderRadius: "25px", border: "none", outline: "none", fontWeight: "600", cursor: "alias" }} >Select Tags</button>
                        </Tooltip>
                        <Select
                            id="leadTags"
                            name="Tags"
                            value={selectedTags}
                            onChange={handleTagsChange}
                            options={leadTagsOptions}
                            isSearchable={true}
                            placeholder="Filter by Selecting Tags"
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
                    <div className="filter-actions">
                        <button onClick={handleApplyFilters} className='filter-btn'>Apply</button>
                    </div>
                </div>
            </div>
            <div className="table-view">
                <div className="filter-section-right">
                    <button onClick={handleFilterSection} className='filter-btn'><span style={{ fontWeight: "normal", letterSpacing: "1px" }}>Filter &nbsp;</span> <FilterListIcon style={{ fontSize: "1rem", color: "white" }} /></button>

                </div>
                <div className="table-container">
                    <TableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <StyledTableCell>#</StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    {
                                        selectLeadType === 'Customer' && (
                                            <StyledTableCell>Company</StyledTableCell>
                                        )
                                    }
                                    {
                                        selectLeadType === 'Customer' && (
                                            <StyledTableCell>Industry</StyledTableCell>
                                        )
                                    }
                                    {
                                        selectLeadType === 'Student' && (
                                            <StyledTableCell>Qualification</StyledTableCell>

                                        )
                                    }
                                    {
                                        selectLeadType === '' && (
                                            <StyledTableCell>Qualification</StyledTableCell>

                                        )
                                    }
                                    {
                                        selectLeadType === '' && (
                                            <StyledTableCell>Industry</StyledTableCell>

                                        )
                                    }
                                    <StyledTableCell>Phone</StyledTableCell>
                                    <StyledTableCell>Created Date</StyledTableCell>
                                    <StyledTableCell>Current Status</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {
                                    filteredLeads.map((lead, index) => (
                                        <TableRow key={index} style={{ backgroundColor: index % 2 === 1 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                            <TableCell style={{ fontSize: "13px" }}>{index + 1}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{lead.leadName}</TableCell>
                                            {
                                                selectLeadType === 'Customer' && (
                                                    <TableCell style={{ fontSize: "13px" }}>{lead.leadCompany}</TableCell>

                                                )
                                            }
                                            {
                                                selectLeadType === 'Customer' && (
                                                    <TableCell style={{ fontSize: "13px" }}>{lead.industry}</TableCell>

                                                )
                                            }
                                            {
                                                selectLeadType === 'Student' && (
                                                    <TableCell style={{ fontSize: "13px" }}>{lead.leadQualification}</TableCell>

                                                )
                                            }
                                            {
                                                selectLeadType === '' && (
                                                    <TableCell style={{ fontSize: "13px" }}>{lead.leadQualification}</TableCell>

                                                )
                                            }
                                            {
                                                selectLeadType === '' && (
                                                    <TableCell style={{ fontSize: "13px" }}>{lead.industry}</TableCell>

                                                )
                                            }
                                            <TableCell style={{ fontSize: "13px" }}>{lead.leadPhoneNumber}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>{formatDate(lead.leadCreatedOn)}</TableCell>
                                            <TableCell style={{ fontSize: "13px" }}>
                                                <span style={{
                                                    backgroundColor: getStatusColor(lead.leadStatus[lead.leadStatus.length - 1]),
                                                    fontWeight: "normal", padding: "8px", fontSize: "13px",
                                                    borderRadius: "4px"
                                                }}
                                                >{lead.leadStatus[lead.leadStatus.length - 1]}</span>
                                            </TableCell>

                                            <TableCell className="btn-grp-table" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <span style={{ display: "flex", alignItems: "center", padding: "5px" }}>
                                                    {renderFollowUpIcon(lead.followUpdate[lead.followUpdate.length - 1])}
                                                </span>
                                                <ActionMenu
                                                    lead={lead}
                                                    handleEdit={() => handleEditClick(lead)}
                                                    handleDeleteClick={() => handleDeleteClick(lead)}
                                                    handleViewLead={() => handleViewLead(lead)} handleClick={handleClick}
                                                />
                                            </TableCell>

                                        </TableRow>

                                    ))
                                }
                            </TableBody>
                        </Table>

                    </TableContainer>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Pagination count={Math.ceil(leads.length / studentsPerPage)} page={page} onChange={handlePageChange} style={{ marginBottom: "2rem" }} />
            </div>

            <WarningModal isOpen={showWarningModal} onClose={handleCloseWarningModal}>
                <div className="modalContent">
                    <img src={warningImage} alt="Warning" className="warningImage" />
                    <h3>Delete the Lead?</h3>
                    <p className="warningText">You will not be able to recover the lead</p>
                    <p style={{ padding: "0", margin: "0", paddingTop: ".5rem" }}>{selectedLead ? selectedLead.leadName : ''}</p>

                    <div className="buttonsContainer">
                        <button onClick={() => confirmDelete(leadToDelete)} className="deleteButton">Delete</button>
                        <button onClick={handleCancel} className="cancelButton">Cancel</button>
                    </div>
                </div>
            </WarningModal>
            {
                showEditModal && (
                    <CustomModal isOpen={showEditModal} selectedLead={selectedLead} onClose={() => setShowEditModal(false)} style={{ maxHeight: "700px", overflowY: "auto" }}>
                        <div className="add-student_container" style={{ margin: "0", padding: "0" }}>
                            <h2 style={{ color: "#0090dd" }}>Update Lead</h2>
                            <form onSubmit={handleLeadsSubmit} className='studentForm' style={{ border: "1px solid rgba(159, 159, 159, 0.497)", borderRadius: "4px", padding: "1rem", margin: "0" }}>

                                <div className="form-group">
                                    <label htmlFor="leadName">Lead Name:</label>
                                    <input
                                        type="text"
                                        id="leadName"
                                        name="leadName"
                                        value={selectedLead.leadName}
                                        onChange={handleInputChangeLeads}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="leadCreatedOn">Lead Created On:</label>
                                    <input
                                        type="date"
                                        id="leadCreatedOn"
                                        name="leadCreatedOn"
                                        value={selectedLead.leadCreatedOn.substring(0, 10)}
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="leadEmail">Email ID:</label>
                                    <input
                                        type="email"
                                        id="leadEmail"
                                        name="leadEmail"
                                        value={selectedLead.leadEmail} required
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="leadPhoneNumber">Phone Number:</label>
                                    <input
                                        type="tel"
                                        id="leadPhoneNumber"
                                        name="leadPhoneNumber"
                                        value={selectedLead.leadPhoneNumber} required
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address:</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={selectedLead.address}
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Lead Type:</label>
                                    <Select
                                        id="leadType"
                                        name="leadType"
                                        value={{ value: selectedLead.leadType, label: selectedLead.leadType }}
                                        onChange={(selectedOption) => setSelectedLead({ ...selectedLead, leadType: selectedOption.value })}
                                        options={leadTypeOptions}
                                        placeholder="Select Lead Type"
                                        isSearchable={true}
                                        required
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
                                    <label htmlFor="leadQualification">Qualification:</label>
                                    <input
                                        type="text"
                                        id="leadQualification"
                                        name="leadQualification"
                                        value={selectedLead.leadQualification}
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="leadCompany">Company:</label>
                                    <input
                                        type="text"
                                        id="leadCompany"
                                        name="leadCompany"
                                        value={selectedLead.leadCompany}
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="industry">Industry:</label>
                                    <Select
                                        id="industry"
                                        name="industry"
                                        value={selectedLead.industry ? { value: selectedLead.industry, label: selectedLead.industry } : null}
                                        onChange={(selectedOption) => setSelectedLead({ ...selectedLead, industry: selectedOption.value })}
                                        options={industries}
                                        placeholder="Select Industry"
                                        isSearchable={true}
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
                                    <label htmlFor="leadJobTitle">Job Title:</label>
                                    <input
                                        type="text"
                                        id="leadJobTitle"
                                        name="leadJobTitle"
                                        value={selectedLead.leadJobTitle}
                                        onChange={handleInputChangeLeads}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="leadSource">Lead Source:</label>
                                    <Select
                                        id="leadSource"
                                        name="leadSource"
                                        value={selectedLead.leadSource ? { value: selectedLead.leadSource, label: selectedLead.leadSource } : null}
                                        onChange={(selectedOption) => setSelectedLead({ ...selectedLead, leadSource: selectedOption.value })}
                                        options={leadSources}
                                        isSearchable={true}
                                        placeholder="Select the Source"
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
                                    <label htmlFor="leadStatus">Lead Status:</label>
                                    <Select
                                        id="leadStatus"
                                        name="leadStatus"
                                        value={selectedLead.leadStatus.map(status => leadStatusOptions ? leadStatusOptions.find(option => option.value === status) : null)}
                                        onChange={(selectedOptions) => setSelectedLead({ ...selectedLead, leadStatus: selectedOptions.map(option => option.value) || [] })}
                                        options={leadStatusOptions}
                                        getOptionValue={(option) => option.value}
                                        getOptionLabel={(option) => option.label}
                                        isSearchable={true}
                                        placeholder="Select the Status"
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
                                    <label htmlFor="followUpDate">Follow Update:</label>
                                    <Select
                                        id="followUpDate"
                                        name="followUpDate"
                                        value={selectedLead.followUpdate.map(date => followUpDateOptions.find(option => option.value === date))}
                                        onChange={(selectedOptions) => setSelectedLead({ ...selectedLead, followUpdate: selectedOptions.map(option => option.value) || [] })}
                                        options={followUpDateOptions}
                                        getOptionValue={(option) => option.value}
                                        getOptionLabel={(option) => option.label}
                                        isSearchable={true}
                                        placeholder="Select Follow Update Type"
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
                                    <label htmlFor="commands">Commands:</label>
                                    <textarea
                                        id="commands"
                                        name="commands"
                                        value={selectedLead.commands}
                                        onChange={handleInputChangeLeads}
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
                )
            }

            {/**View modal display lead values */}
            {
                viewModal && (
                    <ViewLeadModal isOpen={viewModal} onClose={() => setViewModal(false)} children>
                        <div className="view-modal-container">
                            <h1 style={{ padding: "1rem" }}>Lead Details</h1>
                            <div style={{ border: "1px solid rgba(159, 159, 159, 0.497)" }}>
                                <div style={{ margin: "0", padding: "1rem" }}>
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Lead Name</strong></Typography>
                                        <Typography variant="body1">{selectedLead.leadName}</Typography>
                                    </div>
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Lead Created On</strong></Typography>
                                        <Typography variant="body1">{selectedLead.leadCreatedOn}</Typography>
                                    </div>
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Email ID</strong></Typography>
                                        <Typography variant="body1">{selectedLead.leadEmail}</Typography>
                                    </div>
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Phone Number</strong></Typography>
                                        <Typography variant="body1">{selectedLead.leadPhoneNumber}</Typography>
                                    </div>
                                    {selectedLead.address && (
                                        <div className="field-row">
                                            <Typography variant="body1"><strong>Address</strong></Typography>
                                            <Typography variant="body1">{selectedLead.address}</Typography>
                                        </div>
                                    )}
                                    {selectedLead.leadQualification && (
                                        <div className="field-row">
                                            <Typography variant="body1"><strong>Qualification</strong></Typography>
                                            <Typography variant="body1">{selectedLead.leadQualification}</Typography>
                                        </div>
                                    )}
                                    {selectedLead.leadCompany && (
                                        <div className="field-row">
                                            <Typography variant="body1"><strong>Company</strong></Typography>
                                            <Typography variant="body1">{selectedLead.leadCompany}</Typography>
                                        </div>
                                    )}
                                    {selectedLead.leadJobTitle && (
                                        <div className="field-row">
                                            <Typography variant="body1"><strong>Job Title</strong></Typography>
                                            <Typography variant="body1">{selectedLead.leadJobTitle}</Typography>
                                        </div>
                                    )}
                                    {selectedLead.industry && (
                                        <div className="field-row">
                                            <Typography variant="body1"><strong>Industry</strong></Typography>
                                            <Typography variant="body1">{selectedLead.industry}</Typography>
                                        </div>
                                    )}
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Lead Source</strong></Typography>
                                        <Typography variant="body1">{selectedLead.leadSource}</Typography>
                                    </div>
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Lead Status</strong></Typography>
                                        <Typography variant="body1">{selectedLead.leadStatus && selectedLead.leadStatus.join(',')}</Typography>
                                    </div>
                                    <div className="field-row">
                                        <Typography variant="body1"><strong>Follow Update</strong></Typography>
                                        <Typography variant="body1">{selectedLead.followUpdate && selectedLead.followUpdate.join(",")}</Typography>
                                    </div>
                                    {selectedLead.comments && (
                                        <div className="field-row">
                                            <Typography variant="body1"><strong>Comments</strong></Typography>
                                            <Typography variant="body1">{selectedLead.comments}</Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ViewLeadModal>
                )
            }


        </div>

    );
};
export default ViewLeads;
