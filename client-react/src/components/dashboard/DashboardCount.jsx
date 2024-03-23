import React, { useEffect } from 'react'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardCalendar from './DashboardCalendar';
import DashboardChar from './DashboardChar';
import { showEmployees } from '../features/employeesSlice';
import { showStudents } from '../features/studentsSlice';
import { showClients } from "../features/clientSlice";
import { showInvoice } from '../features/invoiceSlice';
import { useDispatch, useSelector } from 'react-redux';
// import ReportStudent from './ReportStudent';
const DashboardCount = () => {

    const employees = useSelector(state => state.employees.employeeEntries) || [];
    const students = useSelector(state => state.students.entries) || [];
    const clients = useSelector(state => state.clients.clientEntries) || [];
    const invoiceDetails = useSelector(state => state.invoices.invoiceEntries) || [];
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showEmployees());
        dispatch(showStudents());
        dispatch(showClients());
        dispatch(showInvoice());
    }, [dispatch]);



    return (
        <div className='dashboard-container'>
            <div className="dashbaord-cards">
                <div className="index-cards">
                    <div className="dash-card" id="employee-card">
                        <div className="dash-text">
                            <h3>Employees</h3>
                            <h4>{employees.length}</h4>
                        </div>
                        <div className="dash-icon">
                            <AccountBoxIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>
                    <div className="dash-card" id="student-card">
                        <div className="dash-text">
                            <h3>Students</h3>
                            <h4>{students.length}</h4>
                        </div>
                        <div className="dash-icon">
                            <GroupsIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>

                    <div className="dash-card" id="project-card">
                        <div className="dash-text">
                            <h3>Clients</h3>
                            <h4>{clients.length}</h4>
                        </div>
                        <div className="dash-icon">
                            <AssessmentIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>
                    <div className="dash-card" id="client-card">
                        <div className="dash-text">
                            <h3>Invoices</h3>
                            <h4>{invoiceDetails.length}</h4>
                        </div>
                        <div className="dash-icon">
                            <PeopleAltIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>

                </div>
            </div>
            <div className="dashboard-charts">
                <div className="charts">
                    <DashboardChar />
                </div>

                <div className="dash-calendar">
                    <h3>Calendar Events</h3>
                    <p>Important Goals and Events are marked</p>
                    <DashboardCalendar />
                </div>
            </div>

        </div>
    )
}

export default DashboardCount
// <ReportStudent />