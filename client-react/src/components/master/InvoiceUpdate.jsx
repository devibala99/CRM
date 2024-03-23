import React, { useState, useEffect } from 'react'
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import { showClients } from '../features/clientSlice';
import { useDispatch, useSelector } from "react-redux";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const InvoiceUpdate = () => {
    const [invoiceId, setInvoiceId] = useState(`KIT/23/001`);
    const clientList = useSelector(state => state.clients.clientEntries);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showClients());
    }, [dispatch]);
    useEffect(() => {
        const currentInvoiceId = localStorage.getItem('currentInvoiceId');
        const lastInvoiceId = clientList[clientList.length - 1];
        if (lastInvoiceId) {
            setInvoiceId(`${lastInvoiceId.invoice_no}`);
        }
        if (currentInvoiceId) {
            setInvoiceId(`${currentInvoiceId}`);
        }
    }, [clientList]);

    const handleIdInput = (e) => {
        e.stopPropagation();
        setInvoiceId(e.target.value);
    }

    const handleSetInvoiceId = (e) => {
        e.stopPropagation();
        const match = invoiceId.match(/^([A-Za-z]+)\/(\d{2})\/(\d{3})$/); // Adjust the regex pattern to match the format "KIT/23/001"
        if (match) {
            const clientIdText = `${match[1]}/${match[2]}/`;
            const clientIdValue = match[3];
            localStorage.setItem("currentInvoiceId", `${clientIdText}${clientIdValue}`);
            setInvoiceId(`${clientIdText}${clientIdValue}`);
            navigate(`/home/new-customer/${encodeURIComponent(invoiceId)}`);
        } else {
            alert('Invalid invoiceId format');
        }
    };
    return (
        <div className="student-container">

            <div className="bread-crumb" >
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/new-client/${invoiceId}`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Student
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Set Invoice ID</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>

            <div className="input-id-content" style={{ marginTop: "2rem" }}>
                <div className="form-group" style={{ padding: "1rem" }}>
                    <label htmlFor="InvoiceUpdate">Invoice ID:</label>
                    <input type="text" id="clientId" name="clientId" value={invoiceId} onChange={(e) => handleIdInput(e)} min="0"
                        placeholder={invoiceId ? '' : 'Enter the invoice number'} required />
                </div>
            </div>
            <div className="btn-class" style={{ paddingBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button onClick={(e) => handleSetInvoiceId(e)} style={{ backgroundColor: "#2196f3", color: "white", fontSize: "1rem", width: "140px", height: "40px", border: "none", outline: "none", borderRadius: "5px" }}>Set ID</button>
            </div>

        </div>
    )
}

export default InvoiceUpdate