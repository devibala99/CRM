import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Login from "./components/login/Login";
import Goals from "./Goals";
import ResetLinkPage from "./components/login/ResetLinkPage"
import ForgotPassword from "./components/login/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardCount from "./components/dashboard/DashboardCount";
import AddStudent from "./components/personInfo/AddStudent";
import AddEmployee from "./components/personInfo/AddEmployee";
import ViewStudent from "./components/personInfo/ViewStudent";
import ViewEmployee from "./components/personInfo/ViewEmployee";
import AddAttendance from "./components/attendance/AddAttendance";
import ViewAttendance from "./components/attendance/ViewAttendance";
import Cashin from "./components/receipt/Cashin";
import CreateCashin from "./components/receipt/CreateCashin";
import CreateCashout from "./components/receipt/CreateCashout";
import Clients from "./components/gst-billing/Clients";
import ViewClient from "./components/gst-billing/ViewClient";
import Gst from "./components/gst-billing/Gst";
import NonGst from "./components/gst-billing/NonGst";
import InvoiceUpdate from "./components/master/InvoiceUpdate";
import StudentId from "./components/master/StudentId";
import CourseFees from "./components/master/CourseFees";
import EmployeeId from "./components/master/EmployeeId";
import Cashout from "./components/receipt/CashOut";
import ManageVendors from "./components/vendors/ManageVendors";
import CreateVendor from "./components/vendors/CreateVendor";
import AddStaff from "./components/master/AddStaff";
import AddManualLead from "./components/leads/AddManualLead";
import AddEcelLeads from "./components/leads/AddEcelLeads";
import ViewLeads from "./components/leads/ViewLeads";
import ReschedulesTable from "./components/leads/ReschedulesTable";
import AddInterview from "./components/interview/AddInterview";
import ViewInterview from "./components/interview/ViewInterview";
import CashInReports from "./components/reports/CashInReports";
import AllUsers from "./components/master/AllUsers";
function App() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const routeTitles = {
            "/login": "User Login",
            "/home": "Dashboard",
            "/home/new-student/:studentId": "Register Student",
            "/home/display-students": "Manage Students",
            "/home/new-employee/:employeeId": "Register Employee",
            "/home/display-employees": "Manage Employees",
            "/home/add-attendance": "Employee Attendance",
            "/home/display-attendance": "Manage Attendance",
            "/home/cashin": "Cash-In",
            "/home/new-customer/:invoiceId": "Register Customer",
            "/home/customer/view": "Manage Customers",
            "/home/gstbilling": "GST Invoice",
            "/home/nongstbilling": "Non-GST Invoice",
            "/home/invoice_id": "Create Invoice ID",
            "/home/std_id": "Create Student ID",
            "/home/employee_id": "Create Employee ID",
            "/home/course_fees": "Plan Course Offering",
            "/home/cashout": "Cash-Out",
            "/home/createCashIn": "Manage-Cash In",
            "/home/createCashOut": "Manage-Cash Out",
            "/home/vendors": "Manage-Vendors",
            "/home/createVendor": "Register Vendor",
            "/home/add_staff": "Create Staff",
            "/home/create_Lead": "Create Lead",
            "/home/display_lead": "Manage Leads",
            "/home/excel-leads": "Manage Leads",
            "/home/add-leads": "Add Leads",
            "/home/rescheduled-leads": "Rescheduled Leads",

            "/home/add-interview": "Schedule Interview",
            "/home/view-interview": "Manage Interviews",
            "/home/manage-reports": "Manage Reports",

            "/home/admins": "Admins",
        };

        const path = location.pathname;
        const title = getTitleFromPath(path, routeTitles);
        document.title = title;

        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [location]);

    const getTitleFromPath = (path, routeTitles) => {
        const parts = path.split("/");
        const baseRoute = parts[parts.length - 2];
        if (baseRoute === "new-student") {
            return "Register Student";
        } else if (baseRoute === "new-employee") {
            return "Register Employee";
        }
        else if (baseRoute === "new-customer") {
            return "Register Customer";
        }
        else if (routeTitles[path]) {
            return routeTitles[path];
        }

        return "KITKAT CRM";
    };


    if (loading) {
        return <CircularProgress style={{ position: 'fixed', top: '50%', left: '50%' }} />;
    }

    return (

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/hrm/reset-password/:id/:token" element={<ResetLinkPage />} />
            <Route path="/home" element={<Dashboard />} >
                <Route index element={<DashboardCount />} />
                <Route path="/home/new-student/:studentId" element={<AddStudent />} />
                <Route path="/home/display-students" element={<ViewStudent />} />
                <Route path="/home/new-employee/:employeeId" element={<AddEmployee />} />
                <Route path="/home/display-employees" element={<ViewEmployee />} />
                <Route path="/home/add-attendance" element={<AddAttendance />} />
                <Route path="/home/display-attendance" element={<ViewAttendance />} />
                <Route path="/home/cashin" element={<Cashin />} />
                <Route path="/home/createCashin" element={<CreateCashin />} />
                <Route path="/home/cashout" element={<Cashout />} />
                <Route path="/home/createCashout" element={<CreateCashout />} />
                <Route path="/home/vendors" element={<ManageVendors />} />
                <Route path="/home/createVendor" element={<CreateVendor />} />
                <Route path="/home/new-customer/:invoiceId" element={<Clients />} />
                <Route path="/home/customer/view" element={<ViewClient />} />
                <Route path="/home/gstbilling" element={<Gst />} />
                <Route path="/home/nongstbilling" element={<NonGst />} />
                <Route path="/home/invoice_id" element={<InvoiceUpdate />} />
                <Route path="/home/std_id" element={<StudentId />} />
                <Route path="/home/employee_id" element={<EmployeeId />} />
                <Route path="/home/course_fees" element={<CourseFees />} />
                <Route path="/home/add_staff" element={<AddStaff />} />
                <Route path="/home/create_lead" element={<AddManualLead />} />
                <Route path="/home/excel-leads" element={<AddEcelLeads />} />
                <Route path="/home/rescheduled-leads" element={<ReschedulesTable />} />
                <Route path="/home/display_lead" element={<ViewLeads />} />
                <Route path="/home/add-interview" element={<AddInterview />} />
                <Route path="/home/view-interview" element={<ViewInterview />} />
                <Route path="/home/manage-reports" element={<CashInReports />} />
                <Route path="/home/admins" element={<AllUsers />} />
            </Route>
            <Route path="/goals" element={<Goals />} />
            <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
    );
}

export default App;


