import React, { useEffect, useState, useCallback } from "react";
import { Button, FormGroup, Input, } from "reactstrap";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import Pagination from '@mui/material/Pagination';
import { read, utils } from "xlsx";
import axios from 'axios';
import "./excelLeads.css"
import ActionMenu from "./ActionMenu";
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomModal from './CustomModal';
import WarningModal from '../master/WarningModal';
import warningImage from "../master/assets/exclamation-mark.png"


const requiredFields = ["DateCol", "Name", "Qualification", "YearOfPassing", "PhoneNumber", "FollowUpdates", "Source"]
const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});
const AddEcelLeads = () => {

    const [loading, setLoading] = useState(false);
    const [excelRows, setExcelRows] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const studentsPerPage = 10;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [editableLead, setEditableLead] = useState(null);
    const [leads, setLeads] = useState([]);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null)
    const [selectedTags, setSelectedTags] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = (await axios.get("http://localhost:8011/excelData/"))
                .data;
            console.log(result, "get");
            setLeads(result);
            setRows(result);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
        }
    }
    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedFileName(file.name);
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = utils.sheet_to_json(worksheet);
                console.log(json, "json-data");
                setExcelRows(json);
            };
            reader.readAsArrayBuffer(file);
        }
    }
    const uploadData = async () => {
        try {
            setLoading(true);
            const firstItemKeys = Object.keys(excelRows[0] || {});
            const missingFields = requiredFields.filter(field => !firstItemKeys.includes(field));

            if (missingFields.length > 0) {
                alert("Required fields are missing: " + missingFields.join(", "));
                setLoading(false);
                return;
            }
            const leadResponse = await axios.get("http://localhost:8011/excelData/");
            const leadList = leadResponse.data || [];
            const leads = excelRows.map(obj => ({
                _id: leadList.find(x => x.Name === obj["Name"])?._id,
                DateCol: new Date((obj["DateCol"] - (25567 + 1)) * 86400 * 1000) || "",
                Name: obj["Name"] || "",
                Qualification: obj["Qualification"] || "",
                YearOfPassing: obj["YearOfPassing"] || "",
                PhoneNumber: obj["PhoneNumber"] || "",
                FollowUpdates: obj["FollowUpdates"] || "",
                Source: obj["Source"] || "",
            }));

            // Split leads into new and updated leads
            const updatedLeads = leads.filter(x => x._id);
            const newLeads = leads.filter(x => !x._id);

            if (updatedLeads.length > 0) {
                await axios.post("http://localhost:8011/excelData/upadte_excelFiles", updatedLeads);
                alert("Successfully updated " + updatedLeads.length + " leads");
            }
            if (newLeads.length > 0) {
                await axios.post("http://localhost:8011/excelData/insert_excelFiles", newLeads);
                alert("Successfully inserted " + newLeads.length + " new leads");
            }
            fetchData();
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error("Error uploading data:", error);
            setLoading(false);
        }
    };

    function formattedDate(dateValue) {
        if (!dateValue) return '';
        const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        if (isNaN(dateObj.getTime())) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const removeFile = () => {
        setSelectedFile(null);
        setExcelRows([]);
        window.location.reload();
    }
    const handleDeleteClick = (lead) => {
        setSelectedLead(lead);
        setShowWarningModal(true);
        console.log(lead, "LeadDe");
    };

    const handleCloseWarningModal = () => {
        setShowWarningModal(false);
    };
    const handleEditClick = (lead) => {
        setEditableLead(lead);
        // console.log(lead);
        setSelectedLead(lead);
        setShowEditModal(true);
    };
    const confirmDelete = async () => {
        try {
            if (selectedLead && selectedLead._id) {
                await axios.delete(`http://localhost:8011/excelData/delete_excelFile/${selectedLead._id}`);
                setLeads(prevLeads => prevLeads.filter(lead => lead._id !== selectedLead._id));
                setShowWarningModal(false);
                alert("Lead deleted successfully");
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
            alert("Error deleting lead");
        }
    };

    const handleCancel = () => {
        setShowWarningModal(false);
    };
    const handleFilterSection = () => {
        setShowSidebar(!showSidebar);
    }
    const handleInputChangeLeads = (event) => {
        const { name, value } = event.target;

        const dateValue = new Date(value);

        setSelectedLead(prevSelectedLead => ({
            ...prevSelectedLead,
            [name]: name === 'DateCol' ? dateValue : value
        }));
    };



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
                Source: selectedLead.Source
            };

            await axios.put(`http://localhost:8011/excelData/update_excelFile/${selectedLead._id}`, updatedLead);
            setLeads(prevLeads => prevLeads.map(lead => lead._id === selectedLead._id ? updatedLead : lead));
            setSelectedLead(null);
            alert('Lead updated successfully');
            window.location.reload();

            setLoading(false);
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Error updating lead. Please try again.');
            setLoading(false);
        }
    };

    function renderDataTable() {
        const indexOfLastStudent = page * studentsPerPage;
        const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
        const currentStudents = rows.slice(indexOfFirstStudent, indexOfLastStudent);
        return (
            <div className="table-view">
                <div className="filter-section-right" style={{ display: "none" }}>
                    <button onClick={handleFilterSection} className='filter-btn'><span style={{ fontWeight: "normal", letterSpacing: "1px" }}>Filter &nbsp;</span> <FilterListIcon style={{ fontSize: "1rem", color: "white" }} /></button>

                </div>
                <br /><br />
                <div className="table-container">
                    <TableContainer component={Paper}>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <StyledTableCell>*</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell>Qualification</StyledTableCell>
                                    <Tooltip title="Year Of Passing">
                                        <StyledTableCell>YOP</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>PhoneNumber</StyledTableCell>
                                    <StyledTableCell>FollowUpdates</StyledTableCell>
                                    <StyledTableCell>Source</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>

                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {currentStudents.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ padding: '20px 10px', fontSize: "13px" }}>{index + 1}</TableCell>
                                        <TableCell style={{ padding: '0px 10px', width: "60px", fontSize: "13px" }}>{formattedDate(item.DateCol)}</TableCell>
                                        <TableCell style={{ padding: '0 10px', fontSize: "13px" }}>{item.Name}</TableCell>
                                        <TableCell style={{ padding: '0 10px', fontSize: "13px" }}>{item.Qualification}</TableCell>
                                        <TableCell style={{ padding: '0 10px', fontSize: "13px" }}>{item.YearOfPassing}</TableCell>
                                        <TableCell style={{ padding: '0 10px', fontSize: "13px" }}>{item.PhoneNumber}</TableCell>
                                        <TableCell style={{ padding: '10 10px', fontSize: "13px" }}>{item.FollowUpdates}</TableCell>
                                        <TableCell style={{ padding: '0 10px', fontSize: "13px" }}>{item.Source}</TableCell>
                                        <TableCell className="btn-grp-table" style={{ display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid rgba(159, 159, 159, 0.497)" }}>

                                            <ActionMenu
                                                lead={item}
                                                handleEdit={() => handleEditClick(item)}
                                                handleDeleteClick={() => handleDeleteClick(item)}
                                            />
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>
                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Pagination
                        count={Math.ceil(rows.length / studentsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        style={{ marginBottom: "2rem" }}
                    />
                </div>

            </div >
        );
    }
    return (
        <div className="student-view-container">
            {/*<h3 className="text-center mt-4 mb-4">React Node Excel</h3>* */}

            <div className="container">
                <div className="bread-crumb">
                    <div className="content-wrapper" style={{ padding: "0 1rem" }}>
                        <div className="input-file-form">
                            <FormGroup>
                                <Tooltip title="Add excel file">
                                    <label htmlFor="inputEmpGroupFile" className="input-button">Add Leads</label>
                                </Tooltip>
                                <Input id="inputEmpGroupFile" name="file" type="file" onChange={readUploadFile}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden />
                            </FormGroup>
                            {selectedFileName && <div>{selectedFileName}</div>}

                            {
                                selectedFile?.name && (
                                    <Button disabled={loading} color="success" onClick={uploadData} className="success-fileButton">{"Upload Data"}
                                    </Button>
                                )
                            }{" "}
                            {
                                selectedFile?.name && (
                                    <Button disabled={loading} color="danger" onClick={removeFile} className="remove-fileButton">{"Remove File"}
                                    </Button>
                                )
                            }
                        </div>
                        <h2 style={{ color: "#0090dd" }}>Manage Leads</h2>
                        <button style={{ visibility: "hidden" }}>Filter</button>
                    </div>
                </div>
                {
                    loading && <progress style={{ width: "100%" }}></progress>
                }

                {renderDataTable()}
                <WarningModal isOpen={showWarningModal} onClose={handleCloseWarningModal}>
                    <div className="modalContent">
                        <img src={warningImage} alt="Warning" className="warningImage" />
                        <h3>Delete the Lead?</h3>
                        <p className="warningText">You will not be able to recover the lead</p>
                        <p style={{ padding: "0", margin: "0", paddingTop: ".5rem" }}>{selectedLead ? selectedLead.Name : ''}</p>

                        <div className="buttonsContainer">
                            <button onClick={() => confirmDelete(leadToDelete)} className="deleteButton">Delete</button>
                            <button onClick={handleCancel} className="cancelButton">Cancel</button>
                        </div>
                    </div>
                </WarningModal>
                {
                    selectedLead && showEditModal && (
                        <CustomModal isOpen={showEditModal} selectedLead={selectedLead} onClose={() => setShowEditModal(false)} style={{ maxHeight: "700px", overflowY: "auto" }}>
                            <div className="add-student_container" style={{ margin: "0", padding: "0" }}>
                                <h2 style={{ color: "#0090dd", padding: "0", margin: "0", paddingBottom: "1rem" }}>Update Lead</h2>
                                <form onSubmit={handleLeadsSubmit} className='studentForm' style={{ border: "1px solid rgba(159, 159, 159, 0.497)", borderRadius: "4px", padding: "1rem", margin: "0" }}>
                                    <div className="form-group">
                                        <label htmlFor="DateCol">Date:</label>
                                        <input
                                            type="date"
                                            id="DateCol"
                                            name="DateCol"
                                            value={selectedLead ? formattedDate(selectedLead.DateCol) : ''}
                                            onChange={handleInputChangeLeads}
                                            required
                                        />

                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="Name">Name:</label>
                                        <input
                                            type="text"
                                            id="Name"
                                            name="Name"
                                            value={selectedLead ? selectedLead.Name : ''}
                                            onChange={handleInputChangeLeads}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="Qualification">Qualification:</label>
                                        <input
                                            type="text"
                                            id="Qualification"
                                            name="Qualification"
                                            value={selectedLead ? selectedLead.Qualification : ''}
                                            onChange={handleInputChangeLeads}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="YearOfPassing">Year Of Passing:</label>
                                        <input
                                            type="text"
                                            id="YearOfPassing"
                                            name="YearOfPassing"
                                            value={selectedLead ? selectedLead.YearOfPassing : ''}
                                            onChange={handleInputChangeLeads}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="PhoneNumber">Phone Number:</label>
                                        <input
                                            type="text"
                                            id="PhoneNumber"
                                            name="PhoneNumber"
                                            value={selectedLead ? selectedLead.PhoneNumber : ''} onChange={handleInputChangeLeads}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="FollowUpdates">Follow Updates:</label>
                                        <input
                                            type="text"
                                            id="FollowUpdates"
                                            name="FollowUpdates"
                                            value={selectedLead ? selectedLead.FollowUpdates : ''}
                                            onChange={handleInputChangeLeads}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="Source">Source:</label>
                                        <input
                                            type="text"
                                            id="Source"
                                            name="Source"
                                            value={selectedLead ? selectedLead.Source : ''} onChange={handleInputChangeLeads}
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
                    )
                }
            </div>
        </div>
    )
}

export default AddEcelLeads;

