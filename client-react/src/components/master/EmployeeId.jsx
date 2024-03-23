import React, { useState, useEffect } from 'react'
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { showEmployees } from "../features/employeesSlice";
import { useSelector, useDispatch } from 'react-redux';
const EmployeeId = () => {
    const [employeeId, setEmployeeId] = useState(`EMP-10001`);

    const employeeList = useSelector(state => state.employees.employeeEntries);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showEmployees());
    }, [dispatch]);
    useEffect(() => {
        const currentEmployeeId = localStorage.getItem('currentEmployeeId');
        const lastEmployeeId = employeeList[employeeList.length - 1];
        if (lastEmployeeId) {
            setEmployeeId(`${lastEmployeeId.employeeId}`)
        }
        if (currentEmployeeId) {
            setEmployeeId(`${currentEmployeeId}`);
        }
    }, [employeeList]);

    const handleIdInput = (e) => {
        e.stopPropagation();
        setEmployeeId(e.target.value);
    }

    const handleSetEmployeeId = (e) => {
        e.stopPropagation();
        const employeeIdText = employeeId.split("-")[0];
        const employeeIdValue = parseInt(employeeId.split("-")[1]);
        localStorage.setItem("currentEmployeeId", `${employeeIdText}-${employeeIdValue}`);
        setEmployeeId(`${employeeIdText}-${employeeIdValue}`);
        console.log(employeeId, employeeIdValue, employeeId.split("-")[0]);

        navigate(`/home/new-employee/${employeeIdText}-${employeeIdValue}`);
    }
    return (
        <div className="student-container">

            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/new-employee/${employeeId}`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Employee
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Set Employee Id</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>

            <div className="input-id-content" style={{ marginTop: "2rem" }}>
                <div className="form-group" style={{ padding: "1rem" }}>
                    <label htmlFor="employeeId">Employee ID:</label>
                    <input type="text" id="employeeId" name="employeeId" value={employeeId} onChange={(e) => handleIdInput(e)} min="0" required />
                </div>
            </div>
            <div className="btn-class" style={{ paddingBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button onClick={(e) => handleSetEmployeeId(e)} style={{ backgroundColor: "#2196f3", color: "white", fontSize: "1rem", width: "140px", height: "40px", border: "none", outline: "none", borderRadius: "5px" }}>Set ID</button>
            </div>

        </div>
    )
}

export default EmployeeId
