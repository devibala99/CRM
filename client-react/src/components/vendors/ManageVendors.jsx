import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVendorDetails, deleteVendorDetail } from '../features/vendorDetailsSlice';
import { Table, TableBody, TableCell, Typography, TableContainer, TableHead, TableRow, Tooltip, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import DetailsModal from '../receipt/DetailsModal';
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
const ManageVendors = () => {
    const dispatch = useDispatch();
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const vendors = useSelector(state => state.vendorDetails.vendorDetailEntries);
    const vendorsPerPage = 10;
    const indexOfLastVendor = page * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = Array.isArray(filteredVendors) && filteredVendors.length > 0 ? filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor) : [];
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [vendorIdToDelete, setVendorIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    useEffect(() => {
        dispatch(getVendorDetails());
    }, [dispatch]);

    useEffect(() => {
        setFilteredVendors(vendors);
    }, [vendors]);

    useEffect(() => {
        if (vendors.length > 0) {
            const filtered = vendors.filter(vendor =>
                (vendor.vendorName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
            setFilteredVendors(filtered);
        } else {
            setFilteredVendors([]);
        }
    }, [vendors, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleDisplayModalOpen = (vendor) => {
        setSelectedVendor(vendor);
        setShowModal(true);
        console.log(vendor, "clicked");
    };

    const handleDeleteClick = (vendor) => {
        setIsWarningModalOpen(true);
        console.log("Vem--", vendor);
        if (vendor) {
            setVendorIdToDelete(vendor);
        }

    };

    const handleCancel = () => {
        setIsWarningModalOpen(false);
        setShowModal(false);
    };

    const confirmDelete = (vendor) => {
        console.log(vendor, "confirm");
        vendors.forEach((v) => {
            if (v.id === vendor.id) {
                dispatch(deleteVendorDetail(v.id));
            }
        });
        setIsWarningModalOpen(false);
        window.location.reload();
    };

    return (
        <div className='student-view-container'>
            {/* Bread Crumb */}
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/createVendor" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Create
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage Vendors</h2>
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
                                    <StyledTableCell>Vendor Type</StyledTableCell>
                                    <StyledTableCell>Mobile Number</StyledTableCell>
                                    <StyledTableCell>Email ID</StyledTableCell>
                                    <StyledTableCell>Current Balance</StyledTableCell>
                                    <StyledTableCell style={{ textAlign: "center" }}>Action</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>
                            {
                                currentVendors.length === 0 ? (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                No Vendors Found. Add Vendors.
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {Array.isArray(currentVendors) && currentVendors.map((vendor, index) => (
                                            <StyledTableRow key={vendor.id} style={{ backgroundColor: index % 2 === 1 ? '#f1f1f1af' : 'transparent', height: "0.5rem" }}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{vendor.vendorName}</TableCell>
                                                <TableCell>{vendor.vendorType}</TableCell>
                                                <TableCell>{vendor.mobileNumber}</TableCell>
                                                <TableCell>{vendor.emailId}</TableCell>
                                                <TableCell>{vendor.currentBalance}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Display Receipt">
                                                        <VisibilityIcon onClick={() => handleDisplayModalOpen(vendor)} className="display-view-btn" />
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteIcon onClick={() => handleDeleteClick(vendor)} className="delete-view-btn" />
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
                        count={Math.ceil(filteredVendors.length / vendorsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                        hideNextButton
                        hidePrevButton
                    />

                    <NextButton
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={page === Math.ceil(filteredVendors.length / vendorsPerPage)}
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
                            <h3>Delete Vendor?</h3>
                            <p className="warningText">You will not be able to recover the vendor details.</p>
                            <div className="buttonsContainer">
                                <button onClick={() => confirmDelete(vendorIdToDelete)} className="deleteButton">Delete</button>
                                <button onClick={handleCancel} className="cancelButton">Cancel</button>
                            </div>
                        </div>
                    </WarningModal>
                )
            }
            {
                showModal && (
                    <DetailsModal isOpen={showModal} onClose={handleCancel}>
                        <div className="view-modal-container" style={{ margin: "0", padding: "0" }}>
                            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h1>Vendor Details</h1>
                                </div>
                                <div>
                                    <h2 className='cancel-model-btn' onClick={handleCancel}>X</h2>
                                </div>
                            </div>
                            <div className="model-flex" style={{ padding: ".4rem", border: "1px solid rgba(159, 159, 159, 0.497)" }}>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Vendor Name</strong></Typography>
                                    <Typography variant="body1"> {selectedVendor.vendorName}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Vendor Type</strong></Typography>
                                    <Typography variant="body1"> {selectedVendor.vendorType}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Mobile Number</strong></Typography>
                                    <Typography variant="body1"> {selectedVendor.mobileNumber}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Email ID</strong></Typography>
                                    <Typography variant="body1"> {selectedVendor.emailId}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Address</strong></Typography>
                                    <Typography variant="body1"> {selectedVendor.address}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Current Balance</strong></Typography>
                                    <Typography variant="body1"> {selectedVendor.currentBalance}</Typography>
                                </div>
                                {
                                    selectedVendor.paidAmount > 0 && (
                                        <div className='field-row'>
                                            <Typography variant="body1"><strong>Paid Amount</strong></Typography>
                                            <Typography variant="body1"> {selectedVendor.paidAmount}</Typography>
                                        </div>
                                    )
                                }
                                {
                                    selectedVendor.remainingAmount > 0 && (
                                        <div className='field-row'>
                                            <Typography variant="body1"><strong>Remaining Amount</strong></Typography>
                                            <Typography variant="body1"> {selectedVendor.remainingAmount}</Typography>
                                        </div>
                                    )
                                }
                                {
                                    selectedVendor.comments !== "" && (
                                        <div className='field-row'>
                                            <Typography variant="body1"><strong>Comments</strong></Typography>
                                            <Typography variant="body1"> {selectedVendor.comments}</Typography>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                    </DetailsModal>
                )
            }

        </div>
    );
};

export default ManageVendors;
