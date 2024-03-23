import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { Delete as DeleteIcon } from '@mui/icons-material';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { showClients, deleteClient } from "../features/clientSlice";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WarningModal from '../master/WarningModal';
import warningSign from "../master/assets/exclamation-mark.png";
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledTableHead = styled(TableHead)({
    backgroundColor: "#D3D3D3",
});

const StyledTableCell = styled(TableCell)({
    color: '#545453',
    fontWeight: 'bold',
    fontSize: "15px",
});
const ViewClient = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClient, setFilteredClient] = useState([]);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const clientsDetail = useSelector(state => state.clients.clientEntries);

    useEffect(() => {
        dispatch(showClients());
    }, [dispatch]);
    useEffect(() => {
        const filtered = clientsDetail.filter(client =>
            client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClient(filtered);
    }, [clientsDetail, searchTerm]);

    // delete warning modal
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState(null);
    const [clientFirstName, setClientFirstName] = useState('');

    const handleDeleteClick = (client) => {
        setIsWarningModalOpen(true);
        console.log(client.id);
        setFieldToDelete(client.id);
        setClientFirstName(client.clientName);
    };
    const handleCancel = () => {
        setIsWarningModalOpen(false);
    };
    const confirmDelete = (fieldToDelete) => {
        console.log(`Deleting field with ID: ${fieldToDelete}`);
        dispatch(deleteClient(fieldToDelete));
        setIsWarningModalOpen(false);
        window.location.reload();
    };
    // pagination
    const clientsPerPage = 5;
    const indexOfLastClient = page * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClient.slice(indexOfFirstClient, indexOfLastClient);
    currentClients.reverse();

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    return (
        <div className='attendance-container'>
            <div className='bread-crumb'>
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to='/home/gstbilling'
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Customer
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Manage Customers</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
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
                                    <StyledTableCell >Client Name</StyledTableCell>
                                    <StyledTableCell>Address</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>State</StyledTableCell>
                                    <StyledTableCell>Contact</StyledTableCell>
                                    <StyledTableCell>Invoice</StyledTableCell>
                                    <StyledTableCell>GST IN</StyledTableCell>

                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {currentClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            No Clients found. Add Clients.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentClients.map((Client) => (
                                        <TableRow key={Client.id}>
                                            <TableCell>{Client.clientName}</TableCell>
                                            <TableCell>{Client.address}</TableCell>
                                            <TableCell className="no-wrap">{Client.date}</TableCell>
                                            <TableCell>{Client.state}</TableCell>
                                            <TableCell>{Client.phoneNumber}</TableCell>
                                            <TableCell>{Client.inVoice_no}</TableCell>
                                            <TableCell>{Client.gst_in}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleDeleteClick(Client)}>
                                                    <DeleteIcon style={{ color: "#9a9a9a" }} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Pagination count={Math.ceil(filteredClient.length / clientsPerPage)} page={page} onChange={handlePageChange} style={{ marginBottom: "2rem" }} />
            </div>
            {
                isWarningModalOpen && (
                    <WarningModal isOpen={isWarningModalOpen} onClose={handleCancel} fieldToDelete={fieldToDelete}>
                        <div className="modalContent">
                            <img src={warningSign} alt="Warning" className="warningImage" />
                            <h3>Delete Client {clientFirstName} ?</h3>
                            <p className="warningText">You will not be able to recover the client details.</p>
                            <div className="buttonsContainer">
                                <button onClick={() => confirmDelete(fieldToDelete)} className="deleteButton">Delete</button>
                                <button onClick={handleCancel} className="cancelButton">Cancel</button>
                            </div>
                        </div>
                    </WarningModal>
                )
            }
        </div>

    )
}

export default ViewClient
