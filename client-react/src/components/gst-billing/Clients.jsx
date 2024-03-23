/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../attendance/attendance.css';
import { createClient, showClients } from "../features/clientSlice";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useParams } from 'react-router-dom';
import "./client.css"

const Clients = () => {
    const { invoiceId: value } = useParams();
    // decode from params
    const initialInvoiceId = decodeURIComponent(value);

    const dispatch = useDispatch();
    const clientsDetail = useSelector(state => state.clients.clientEntries);
    // set invoice id
    const initialInvoiceIdLocal = localStorage.getItem('currentInvoiceId') || initialInvoiceId || `KIT/24/001`;
    const [currentInvoiceIdText, setCurrentInvoiceIdText] = useState('');
    const [currentInvoiceIdNumber, setCurrentInvoiceIdNumber] = useState('');

    useEffect(() => {
        const match = initialInvoiceIdLocal.match(/^([A-Za-z]+)\/(\d{2})\/(\d{3})$/);
        if (match) {
            const initialInvoiceIdText = match[1] + "/" + match[2] + "/";
            const initialInvoiceIdNumber = parseInt(match[3]);
            const paddedInvoiceIdNumber = initialInvoiceIdNumber.toString().padStart(3, '0');
            setCurrentInvoiceIdText(initialInvoiceIdText);
            setCurrentInvoiceIdNumber(paddedInvoiceIdNumber);
        } else {
            console.error("Initial invoice ID does not match expected pattern:", initialInvoiceIdLocal);
        }
    }, [initialInvoiceIdLocal]);
    const [clientForm, setClientForm] = useState({
        clientName: '',
        address: '',
        date: '',
        state: '',
        inVoice_no: `${currentInvoiceIdText}${currentInvoiceIdNumber}`,
        phoneNumber: '',
        gst_in: ''
    });
    useEffect(() => {
        dispatch(showClients());
    }, [dispatch]);

    useEffect(() => {
        if (!isNaN(currentInvoiceIdNumber)) {
            setClientForm(prevState => ({
                ...prevState,
                inVoice_no: `${currentInvoiceIdText}${currentInvoiceIdNumber}`
            }));
        } else {
            setClientForm(prevState => ({
                ...prevState,
                inVoice_no: `${currentInvoiceIdText}001`
            }));
        }
    }, [currentInvoiceIdText, currentInvoiceIdNumber]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        if (e.target.type === 'radio') {
            setClientForm(prevState => ({
                ...prevState,
                [name]: value === 'Yes',
            }));
        } else {
            setClientForm(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleClientSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createClient(clientForm));
            const nextInvoiceId = (parseInt(currentInvoiceIdNumber) + 1).toString().padStart(3, '0');
            const fullInvoiceId = `${currentInvoiceIdText}${nextInvoiceId}`;
            localStorage.setItem('currentInvoiceId', fullInvoiceId);
            setCurrentInvoiceIdNumber(nextInvoiceId);
            setClientForm({
                clientName: '',
                address: '',
                date: '',
                state: '',
                inVoice_no: `${fullInvoiceId}`,
                phoneNumber: '',
                gst_in: ''
            })
        }
        catch (error) {
            console.log("Error:", error);

        }
    }
    return (
        <div className='attendance-container'>
            <div className='bread-crumb'>
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to='/home/gstbilling'
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <ReceiptLongIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; GST Invoice
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Register Customer</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>

            <div className='add-emp_atten_container'>
                <form onSubmit={handleClientSubmit} className='attendance-form'>
                    <div className="form-group">
                        <label>Client Name:</label>
                        <input type="text" name="clientName" value={clientForm.clientName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input type="text" name="address" value={clientForm.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Contact Number:</label>
                        <input type='text' value={clientForm.phoneNumber} onChange={handleInputChange} name='phoneNumber' />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type='date' value={clientForm.date} onChange={handleInputChange} name='date' />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <select value={clientForm.state} onChange={handleInputChange} name='state'>
                            <option value=''>Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                            <option value="Daman and Diu">Daman and Diu</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Puducherry">Puducherry</option>

                        </select>
                    </div>
                    <div className="form-group">
                        <label>Invoice No:</label>
                        <input type='text' value={clientForm.inVoice_no} onChange={handleInputChange} name='inVoice_no' readOnly />
                    </div>
                    <div className="form-group">
                        <label>GST IN:</label>
                        <input type='text' value={clientForm.gst_in} onChange={handleInputChange} name='gst_in' />
                    </div>
                    <div className="full-width">
                        <div className="btn-submit">
                            <button type="submit">Create</button>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}

export default Clients
