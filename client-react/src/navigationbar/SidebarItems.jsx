import { useState } from "react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import { useDispatch } from 'react-redux';
import { logout } from '../components/features/loginUserSlice';

import "./sidebar.css"

export default function SidebarItems({ item, sidebarWidth }) {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };
    if (item.dropdowns && sidebarWidth !== '60px') {
        return (
            <div className="sidebar-list">
                <div className={open ? "sidebar-item open" : "sidebar-item"}>
                    <div className="sidebar-title" onClick={() => setOpen(!open)} style={{ fontSize: "16px", color: "#0090dd" }}>
                        <span style={{ color: "#0090dd" }}>
                            {item.icon}&emsp;
                            <span style={{ fontSize: "16px" }}> {item.title}</span>
                        </span>
                        <ExpandMoreIcon />
                    </div>
                    <hr style={{ border: "1px solid rgba(159, 159, 159, 0.497)" }} />
                    <div className="sidebar-content">
                        {open && item.dropdowns.map((child) => (
                            <SidebarItems key={child.id} item={child} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    else if (sidebarWidth === '60px' && ['Dashboard', 'Student Info', 'Attendance', 'Receipt', 'Leads', 'Vendors', 'Billing', 'Customer', 'Master', 'Logout'].includes(item.title)) {
        return (
            <div className="sidebar-list-min">
                {item.title === 'Logout' ? (
                    <div className="sidebar-item plain" style={{ fontSize: "16px", textDecoration: "none", color: "#0090dd" }} onClick={handleLogout}>
                        <Tooltip title={item.title} placement="right-start">
                            {item.icon}
                        </Tooltip>
                    </div>
                ) : (
                    <Link to={item.path || "/home"} className="sidebar-item plain" style={{ fontSize: "16px", textDecoration: "none", color: "#0090dd" }}>
                        <Tooltip title={item.title} placement="right-start">
                            {item.icon}
                        </Tooltip>
                    </Link>
                )}
            </div>
        );
    }
    else {
        return (
            <div className="sidebar-list" style={{ width: "100%", color: "#0090dd" }}>
                <Link to={item.path || "/home"} className="sidebar-item plain" style={{ fontSize: "16px", textDecoration: "none", color: "#0090dd", width: "100%" }}>
                    <span style={{ fontSize: "16px", color: "#0090dd" }}>
                        {item.icon} &emsp;
                        {item.title}
                    </span>
                </Link>
                <hr style={{ border: "1px solid rgba(159, 159, 159, 0.497)" }} />
            </div>
        );
    }
}