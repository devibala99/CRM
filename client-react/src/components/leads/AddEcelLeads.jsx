/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { FormGroup, Input, } from "reactstrap";
import { Table, TableBody, Menu, MenuItem, Button, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { styled } from '@mui/system';
import axios from 'axios';
import "./excelLeads.css"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getStaffDetails } from "../features/staffSlice";
import { fetchCourse } from '../features/courseSlice';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomModal from './CustomModal';
import WarningModal from '../master/WarningModal';
import warningImage from "../master/assets/exclamation-mark.png"
import { utils, read } from "xlsx";
import { EXCEL_FILE_BASE64 } from "./constants";
import FileSaver from "file-saver"
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import "./printPreview.css"
import Pagination from '@mui/material/Pagination'

const sourceOptions = [
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Ads', label: 'Ads' }
];
const followUpdatesOptions = [
    { value: 'Interested', label: 'Interested' },
    { value: 'Not Interested', label: 'Not Interested' },
    { value: 'Call Back', label: 'Call Back' },
    { value: 'No Response', label: 'No Response' },
    { value: 'Call Done', label: 'Call Done' }
];
const detailSentOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
];

const requiredFields = ["DateCol", "Name", "Qualification", "YearOfPassing", "PhoneNumber", "FollowUpdates", "Source", "Location", "Rescheduled"];
const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "13px",
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
const AddEcelLeads = () => {

    const tableRef = useRef(null);

    const [staffList, setStaffList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const availableCourses = useSelector(state => state.courses.courseEntries);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStaffDetails())
            .then(response => {
                const staffPayload = response.payload;
                const staffList = Array.isArray(staffPayload) ? staffPayload.map(staff => ({ value: staff.staffName, label: staff.staffName })) : [];
                setStaffList(staffList);
            })
            .catch(error => {
                console.error('Error fetching staff details:', error);
            });

        dispatch(fetchCourse())
            .then(response => {
                const coursePayload = response.payload;
                const courseList = Array.isArray(coursePayload) ? coursePayload.map(course => ({ value: course.course, label: course.course })) : [];
                setCourseList(courseList);
            })
            .catch(error => {
                console.error('Error fetching course data:', error);
            });
    }, [dispatch]);


    useEffect(() => {
        setCourses(availableCourses);
    }, [availableCourses]);

    const [loading, setLoading] = useState(false);
    const [isPrint, setIsPrint] = useState(false);
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
    const [endDate, setEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLeads, setFilteredLeads] = useState([]);
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = (await axios.get("http://localhost:8011/excelData/"))
                .data;
            setLeads(result);
            setRows(result);
            setFilteredLeads(result);
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
            const leads = excelRows.map(obj => {
                const dateCol = obj["DateCol"] ? new Date((obj["DateCol"] - (25567 + 1)) * 86400 * 1000).toISOString().split('T')[0] : '';
                const rescheduled = obj["Rescheduled"] ? new Date((obj["Rescheduled"] - (25567 + 1)) * 86400 * 1000).toISOString().split('T')[0] : '';

                return {
                    _id: leadList.find(x => x.Name === obj["Name"])?._id,
                    DateCol: dateCol,
                    Name: obj["Name"] || "",
                    Qualification: obj["Qualification"] || "",
                    YearOfPassing: obj["YearOfPassing"] || "",
                    PhoneNumber: obj["PhoneNumber"] || "",
                    FollowUpdates: (obj["FollowUpdates"] || "").split('.').map(update => update.trim()).filter(update => update !== ""),
                    Source: obj["Source"] || "",
                    Location: obj["Location"] || "",
                    FollowupPerson: obj["FollowupPerson"] || "",
                    Course: obj["Course"] || "",
                    DetailsSent: obj["DetailsSent"] || "",
                    Rescheduled: rescheduled,
                };
            });
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
        return `${day}-${month}-${year}`;
    }

    const removeFile = () => {
        setSelectedFile(null);
        setExcelRows([]);
        window.location.reload();
    }
    const handleCloseWarningModal = () => {
        setShowWarningModal(false);
    };
    const handleDeleteClick = (lead) => {
        setLeadToDelete(lead);
        setSelectedLead(lead);
        setShowWarningModal(true);
        // console.log(lead, "LeadDe");
    };

    const handleEditClick = (lead) => {
        setEditableLead(lead);
        console.log(lead);
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
                window.location.reload();

            }
        } catch (error) {
            console.error('Error deleting lead:', error);
            alert("Error deleting lead");
        }
    };

    const handleCancel = () => {
        setShowWarningModal(false);
        setShowEditModal(false);
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
                Source: selectedLead.Source,
                Location: selectedLead.Location,
                FollowupPerson: selectedLead.FollowupPerson,
                DetailsSent: selectedLead.DetailsSent,
                Rescheduled: selectedLead.Rescheduled,
                Course: selectedLead.Course,
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

    const downloadSampleFile = () => {
        let sliceSize = 1024;
        let byteCharacters = atob(EXCEL_FILE_BASE64);
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);
            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        FileSaver.saveAs(
            new Blob(byteArrays, { type: "application/vnd.ms-excel" }),
            "sample.xlsx"
        );
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
    function renderDataTable() {
        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const getYearString = (date) => {
            return date.getFullYear();
        };

        const sortedLeads = leads.sort((a, b) => {
            const dateA = new Date(a.DateCol);
            const dateB = new Date(b.DateCol);

            const yearA = getYearString(dateA);
            const yearB = getYearString(dateB);
            // If leads are from the same year, sort by date in descending order
            if (yearA === yearB) {
                return dateB - dateA;
            }
            // Otherwise, sort leads by year in descending order
            return yearB - yearA;
        });

        const indexOfLastLead = page * studentsPerPage;
        const indexOfFirstLead = indexOfLastLead - studentsPerPage;
        const currentLeadsPage = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

        const convertToExcelDownload = () => {
            setIsPrint(true);
            const table = tableRef.current;
            const rows = table.rows;
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                if (cells.length > 0) {
                    const lastCellIndex = cells.length - 1;
                    rows[i].deleteCell(lastCellIndex);
                }
            }
            const htmlTable = table.outerHTML;

            const excelFile = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                    <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
                    <body>${htmlTable}</body>
                </html>`;

            const blob = new Blob([excelFile], { type: 'application/vnd.ms-excel' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "table.xls";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);
            }, 100);
        };


        const convertToExcel = () => {
            setIsPrint(true);
            const table = tableRef.current;
            const rows = table.rows;
            let excelContent = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                    <head>
                        <style>
                            table {
                                border-collapse: collapse;
                            }
                            th, td {
                                border: 1px solid black;
                                padding: 8px;
                            }
        
                            @media print {
                                body {
                                    -webkit-print-color-adjust: exact;
                                    -moz-print-color-adjust: exact;
                                    -o-print-color-adjust: exact;
                                    -ms-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                    padding:2rem;
                                }
        
                                @page {
                                    margin: 0;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <table>`;

            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].cells;
                excelContent += '<tr>';
                for (let j = 0; j < cells.length; j++) {
                    const cell = cells[j];
                    const colspan = cell.getAttribute('colspan');
                    const rowspan = cell.getAttribute('rowspan');
                    if (!isPrint && j === cells.length - 1) continue; // Skip "Actions" column cells if not printing
                    excelContent += `<${i === 0 ? 'th' : 'td'} style="border: 1px solid black; padding: 8px;"`;
                    if (colspan) {
                        excelContent += ` colspan="${colspan}"`;
                    }
                    if (rowspan) {
                        excelContent += ` rowspan="${rowspan}"`;
                    }
                    excelContent += `>${cell.innerHTML}</${i === 0 ? 'th' : 'td'}>`;
                }
                excelContent += '</tr>';
            }

            excelContent += `
                        </table>
                    </body>
                </html>`;

            return excelContent;
        };

        // Function to open print preview
        const openPrintPreview = () => {
            const excelContent = convertToExcel();
            const printWindow = window.open('', '_blank');
            printWindow.document.write(excelContent);
            printWindow.document.close();
            printWindow.print();
            window.location.reload();
        };
        function applyFilters(leads, startDate, endDate, searchTerm) {
            let filteredLeads = leads;

            // Filter by date range
            if (startDate && endDate) {
                filteredLeads = filteredLeads.filter(lead => {
                    const leadDate = new Date(lead.DateCol);
                    return leadDate >= startDate && leadDate <= endDate;
                });
            }
            // Filter by search term
            if (searchTerm) {
                const searchValue = searchTerm.toLowerCase();
                filteredLeads = filteredLeads.filter(lead =>
                    Object.values(lead).some(value => {
                        if (typeof value === 'string') {
                            return value.toLowerCase().includes(searchValue);
                        } else if (Array.isArray(value) && value.length > 0 && typeof value[value.length - 1] === 'string') {
                            return value[value.length - 1].toLowerCase().includes(searchValue);
                        }
                        return false;
                    })
                );
            }
            return filteredLeads;
        }
        const handleShortcutClick = (shortcut) => {
            const today = new Date();
            let start, end;
            switch (shortcut) {
                case 'today':
                    start = new Date(today);
                    end = new Date(today);
                    break;
                case 'thisWeek':
                    start = new Date(today.setDate(today.getDate() - today.getDay()));
                    end = new Date(today.setDate(today.getDate() + 6));
                    break;
                case 'lastWeek':
                    start = new Date(today.setDate(today.getDate() - today.getDay() - 7));
                    end = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                    break;
                case 'thisMonth':
                    start = new Date(today.getFullYear(), today.getMonth(), 1);
                    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    break;
                case 'lastMonth':
                    start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    end = new Date(today.getFullYear(), today.getMonth(), 0);
                    break;
                case 'thisYear':
                    start = new Date(today.getFullYear(), 0, 1);
                    end = new Date(today.getFullYear(), 11, 31);
                    break;
                case 'lastYear':
                    start = new Date(today.getFullYear() - 1, 0, 1);
                    end = new Date(today.getFullYear() - 1, 11, 31);
                    break;
                default:
                    start = null;
                    end = null;
            }
            setStartDate(start);
            setEndDate(end);
            const filteredLeads = applyFilters(leads, startDate, endDate, searchTerm);
            setFilteredLeads(filteredLeads);
            setPage(1);

        };
        function handleSearch(event) {
            const searchValue = event.target.value.toLowerCase();
            setSearchTerm(searchValue);
            const filteredLeads = applyFilters(leads, startDate, endDate, searchValue);
            setFilteredLeads(filteredLeads);
            setPage(1);
        }

        function handleClearFilters() {
            setStartDate(null);
            setEndDate(null);
            setSearchTerm('');

            const filteredLeads = applyFilters(leads, null, null, '');
            setFilteredLeads(filteredLeads);
            setShowSidebar(false);
            setPage(1);
        }
        const handleCourseMenuOpen = (event) => {
            setCourseMenuAnchor(event.currentTarget);
        };

        const handleCourseMenuClose = () => {
            setCourseMenuAnchor(null);
        };

        const handleCourseSelection = (courseName) => {
            setSelectedCourse(courseName);
            setSearchTerm(courseName);
            handleCourseMenuClose();
            const filteredLeads = applyFilters(leads, startDate, endDate, courseName);
            setFilteredLeads(filteredLeads);
            setPage(1);
        };

        return (
            <div className="table-view" style={{ padding: "0", margin: "0" }}>
                <div className="filter-section-right" style={{ alignItems: "center", padding: "0", margin: "0" }}>
                    <div className="title" style={{ color: "#0090dd", paddingLeft: "1rem" }}>
                        <h2>Manage Leads</h2>
                    </div>
                    <div className="section-content-btns">
                        <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '4px' }}>
                            <Link to="/home/create_lead" className="custom-link" style={{ fontSize: "16px", padding: "0.6rem", margin: "0" }}>
                                <span style={{ fontWeight: "normal", letterSpacing: "1px", height: "100%", color: "white" }}>Add Leads</span>
                                &nbsp; <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            </Link>
                        </div>
                        <div className="btn-sec-shortcut">
                            <FormGroup>
                                <Tooltip title="Add excel file">
                                    <label htmlFor="inputEmpGroupFile" className="filter-btn" style={{ padding: ".5rem", width: "120px", height: "95%", cursor: "pointer" }}>Bulk Data &nbsp;<UploadFileIcon style={{ fontSize: "1rem", color: "white" }} /></label>
                                </Tooltip>
                                <Input id="inputEmpGroupFile" name="file" type="file" onChange={readUploadFile}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden />
                            </FormGroup>
                            {selectedFileName && <div style={{ color: "white" }}>{selectedFileName}</div>}

                            {
                                selectedFile?.name && (
                                    <button disabled={loading} color="success" onClick={uploadData}
                                        className="success-fileButton">Upload
                                    </button>
                                )
                            }
                            {
                                selectedFile?.name && (
                                    <button disabled={loading} color="danger" onClick={removeFile} className="remove-fileButton">Remove
                                    </button>
                                )
                            }
                        </div>

                        <div className="btn-sec-shortcut sample-btn" style={{ height: "35px" }}>
                            <button onClick={downloadSampleFile} className="filter-btn" style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ fontWeight: "normal", letterSpacing: "1px", height: "100%", paddingTop: "1rem" }}
                                >
                                    Sample &nbsp;</span>
                                <DownloadIcon style={{ fontSize: "1rem", color: "white" }} /></button>
                        </div>
                        <div className="btn-sec-shortcut">
                            <button onClick={handleFilterSection} className='filter-btn'><span style={{ fontWeight: "normal", letterSpacing: "1px" }}>Filter &nbsp;</span> <FilterListIcon style={{ fontSize: "1rem", color: "white" }} /></button>
                        </div>

                        <div className="btn-sec-shortcut">
                            <button onClick={convertToExcelDownload} className='filter-btn'><span style={{ fontWeight: "normal", letterSpacing: "1px" }}>Excel &nbsp;</span> <DownloadIcon style={{ fontSize: "1rem", color: "white" }} /></button>
                        </div>
                        <div className="btn-sec-shortcut">
                            <button onClick={openPrintPreview} className='filter-btn'><span style={{ fontWeight: "normal", letterSpacing: "1px" }}>Print &nbsp;</span> <PrintIcon style={{ fontSize: "1rem", color: "white" }} /></button>
                        </div>
                    </div>
                </div>
                <div className={`dropdown-container ${showSidebar ? 'open' : ''}`}>
                    <div className='date-range_column'>
                        <div className="column-segment">
                            <div className='calendar-inputs'>
                                <div className="individual-date-set">
                                    <label htmlFor="fromDate">From:</label>
                                    <DatePicker
                                        id="fromDate"
                                        onChange={date => setStartDate(date)}
                                        selected={startDate}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        className="custom-datepicker"
                                        placeholderText="Pick Start Date"
                                    />
                                </div>
                                <div className="individual-date-set">
                                    <label htmlFor="toDate">To:</label>
                                    <DatePicker
                                        id="toDate"
                                        onChange={date => setEndDate(date)}
                                        selected={endDate}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        className="custom-datepicker"
                                        placeholderText="Pick End Date"
                                    />
                                </div>
                            </div>
                            <div className="short-tags">
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('today')}>Today</button>
                                </Tooltip>
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('thisWeek')}>This Week</button>
                                </Tooltip>
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('lastWeek')}>Last Week</button>
                                </Tooltip>
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('thisMonth')}>This Month</button>
                                </Tooltip>
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('lastMonth')}>Last Month</button>
                                </Tooltip>
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('thisYear')}>This Year</button>
                                </Tooltip>
                                <Tooltip title="Double Tap">
                                    <button onClick={() => handleShortcutClick('lastYear')}>Last Year</button>
                                </Tooltip>
                                <button onClick={handleClearFilters}>Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
                <br /><br />
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
                        <Table ref={tableRef}>
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
                                    <StyledTableCell>
                                        <Button
                                            aria-controls="course-menu"
                                            aria-haspopup="true"
                                            onClick={handleCourseMenuOpen}
                                            style={{ color: "#545453", fontWeight: "bold", textTransform: "capitalize", fontSize: ".9rem" }}
                                        >
                                            Course
                                        </Button>
                                        <Menu
                                            id="course-menu"
                                            anchorEl={courseMenuAnchor}
                                            keepMounted
                                            open={Boolean(courseMenuAnchor)}
                                            onClose={handleCourseMenuClose}
                                        >
                                            {courses.length > 0 && courses.map(course => (
                                                <MenuItem key={course._id} onClick={() => handleCourseSelection(course.course)}>
                                                    {course.course}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </StyledTableCell>

                                    <StyledTableCell>FolUps</StyledTableCell>
                                    <Tooltip title="Course Detail Sent">
                                        <StyledTableCell>Sent</StyledTableCell>
                                    </Tooltip>
                                    <Tooltip title="Rescheduled">
                                        <StyledTableCell>Reschd</StyledTableCell>
                                    </Tooltip>
                                    <StyledTableCell>Assignee</StyledTableCell>
                                    <StyledTableCell>Source</StyledTableCell>

                                    <StyledTableCell style={{ display: isPrint ? "none" : "" }}>Actions</StyledTableCell>

                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {currentLeadsPage.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ padding: '20px 10px', fontSize: "11px" }}>{index + 1}</TableCell>
                                        <TableCell style={{ padding: '0px 10px', width: "60px", fontSize: "11px" }}>{formattedDate(item.DateCol)}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.Name}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.Qualification}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.YearOfPassing}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.PhoneNumber}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.Location}</TableCell>
                                        <TableCell style={{ padding: '10 5px', fontSize: "11px" }}>{item.Course}</TableCell>
                                        <TableCell style={{ padding: '10 5px', fontSize: "11px" }}>
                                            <span style={{
                                                color: getStatusColor(item.FollowUpdates[item.FollowUpdates.length - 1]),
                                                fontSize: "11px", fontWeight: "bold",
                                                borderRadius: "4px"
                                            }}
                                            >{item.FollowUpdates[item.FollowUpdates.length - 1]}</span>
                                        </TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.DetailsSent}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{formattedDate(item.Rescheduled)}</TableCell>
                                        <TableCell style={{ padding: '10 5px', fontSize: "11px" }}>{item.FollowupPerson}</TableCell>
                                        <TableCell style={{ padding: '0 5px', fontSize: "11px" }}>{item.Source}</TableCell>

                                        <TableCell className="btn-grp-table" style={{ display: isPrint ? "none" : "flex", flexWrap: "nowrap", width: "80px", justifyContent: "flex-start", alignItems: "center", padding: "23px 10px" }}>
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
                        count={Math.ceil(filteredLeads.length / studentsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                        hideNextButton
                        hidePrevButton
                    />

                    <NextButton
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={page === Math.ceil(filteredLeads.length / studentsPerPage)}
                    >
                        Next
                    </NextButton>
                </div>

            </div>
        );
    }

    return (
        <div className="student-view-container">
            <div className="container">
                {/**  <div className="bread-crumb">
                   
    </div> */}
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
                            <button onClick={() => confirmDelete(selectedLead)} className="deleteButton">Delete</button>
                            <button onClick={handleCancel} className="cancelButton">Cancel</button>
                        </div>
                    </div>
                </WarningModal>
                {
                    selectedLead && showEditModal && (
                        <CustomModal isOpen={showEditModal} selectedLead={selectedLead} onClose={() => setShowEditModal(false)} style={{ maxHeight: "700px", overflowY: "auto" }}>
                            <div className="add-student_container" style={{ margin: "0", padding: "0" }}>
                                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <h1>Update Lead Information</h1>
                                    </div>
                                    <div>
                                        <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                                    </div>
                                </div>
                                <form onSubmit={handleLeadsSubmit} className='studentForm' style={{ border: "1px solid rgba(159, 159, 159, 0.497)", borderRadius: "4px", padding: "1rem", margin: "0" }}>
                                    <div className="form-group">
                                        <label htmlFor="DateCol">Date:</label>
                                        <input
                                            type="date"
                                            id="DateCol"
                                            name="DateCol"
                                            value={selectedLead ? selectedLead.DateCol : ''}
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
                                        <label htmlFor="Location">Location:</label>
                                        <input
                                            type="text"
                                            id="Location"
                                            name="Location"
                                            value={selectedLead.Location}
                                            onChange={handleInputChangeLeads}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="FollowUpdates">Follow Updates:</label>
                                        <Select
                                            id="FollowUpdates"
                                            name="FollowUpdates"
                                            options={followUpdatesOptions}
                                            value={selectedLead.FollowUpdates.map(status => ({
                                                value: status,
                                                label: status
                                            }))}
                                            onChange={(selectedOptions) => setSelectedLead({
                                                ...selectedLead,
                                                FollowUpdates: selectedOptions.map(option => option.value) || []
                                            })}
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
                                        <label htmlFor="DetailsSent">Details Sent:</label>
                                        <Select
                                            id="DetailsSent"
                                            name="DetailsSent"
                                            options={detailSentOptions}
                                            value={detailSentOptions.find(option => option.value === selectedLead.DetailsSent)}
                                            onChange={(selectedOption) => setSelectedLead({ ...selectedLead, DetailsSent: selectedOption.value })}
                                            required
                                            placeholder="Select Details Sent Options"
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
                                        <label htmlFor="FollowupPerson">Assigned To:</label>
                                        <Select
                                            id="FollowupPerson"
                                            name="FollowupPerson"
                                            options={staffList}
                                            value={staffList.find(option => option.value === selectedLead.FollowupPerson)}
                                            onChange={(selectedOption) => setSelectedLead({ ...selectedLead, FollowupPerson: selectedOption.value })}
                                            placeholder="Choose a Staff Member"
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
                                        <label htmlFor="Rescheduled">Rescheduled:</label>
                                        <input
                                            type="date"
                                            id="Rescheduled"
                                            name="Rescheduled"
                                            value={selectedLead ? selectedLead.Rescheduled : ''}
                                            onChange={handleInputChangeLeads}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="Course">Course:</label>
                                        <Select
                                            type="text"
                                            id="Course"
                                            name="Course"
                                            options={courseList}
                                            value={courseList.find(option => option.value === selectedLead.Course)}
                                            onChange={(selectedOption) => setSelectedLead({ ...selectedLead, Course: selectedOption.value })}
                                            isSearchable={true}
                                            placeholder="Select the Course"
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
                                        <label htmlFor="Source">Source:</label>
                                        <Select
                                            id="Source"
                                            name="Source"
                                            options={sourceOptions}
                                            value={sourceOptions.find(option => option.value === selectedLead.Source)}
                                            onChange={(selectedOption) => setSelectedLead({ ...selectedLead, Source: selectedOption.value })}
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

