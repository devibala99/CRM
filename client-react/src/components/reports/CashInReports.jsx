/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getStudentReceipts } from '../features/studentReceiptSlice';
import { getReceipts } from '../features/customerReceiptSlice';
import { getCashoutReceipts } from '../features/cashoutReceiptsSlice';

import AssessmentIcon from '@mui/icons-material/Assessment';

import "./reports.css"
const groupByMonthAndYear = (data) => {
    const groupedData = {};
    data.forEach(entry => {
        const dateComponents = entry.billDate.split(/[\/-]/);
        const day = parseInt(dateComponents[0]);
        const month = parseInt(dateComponents[1]);
        const year = parseInt(dateComponents[2]);

        const date = new Date(year, month - 1, day);
        const key = `${year}-${month}`;
        // console.log(`Processing entry:`, entry);
        // console.log(`Entry year: ${year}, month: ${month}`);
        // console.log(`Group key: ${key}`);
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push({ ...entry, billDate: date });
    });
    return groupedData;
};

const CashInReports = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const getStudentReceiptsData = useSelector(state => state.studentReceipts.studentReceiptEntries) || [];
    const getCustomerReceiptsData = useSelector(state => state.customerReceipts.customerReceiptEntries) || [];
    const getCashoutReceiptsData = useSelector(state => state.cashoutReceipts.cashoutReceiptEntries) || [];
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getStudentReceipts());
        dispatch(getCashoutReceipts());
        dispatch(getReceipts());
    }, [dispatch]);
    // console.log("Student Receipts Data:", getStudentReceiptsData);
    // console.log("Customer Receipts Data:", getCustomerReceiptsData);
    // console.log("Cashout Receipts Data:", getCashoutReceiptsData);

    const filteredStudentData = getStudentReceiptsData.filter(entry => {
        const dateComponents = entry.billDate.split(/[\/-]/);
        const year = parseInt(dateComponents[2]);
        return year === selectedYear;
    });

    const filteredCustomerData = getCustomerReceiptsData.filter(entry => {
        const dateComponents = entry.billDate.split(/[\/-]/);
        const year = parseInt(dateComponents[2]);
        return year === selectedYear;
    });

    const filteredCashoutData = getCashoutReceiptsData.filter(entry => new Date(entry.billDate).getFullYear() === selectedYear);

    // console.log("Filtered Student Data:", filteredStudentData);
    // console.log("Filtered Customer Data:", filteredCustomerData);
    // console.log("Filtered Cashout Data:", filteredCashoutData);

    // Group data
    const groupedStudentData = groupByMonthAndYear(filteredStudentData.map(entry =>
        ({ type: 'Student', billDate: entry.billDate, amount: entry.paidAmount })));
    const groupedCustomerData = groupByMonthAndYear(filteredCustomerData.map(entry => ({ type: 'Customer', billDate: entry.billDate, amount: entry.paidAmount })));
    const groupedCashoutData = groupByMonthAndYear(filteredCashoutData.map(entry => ({ type: 'Cashout', billDate: entry.billDate, amount: entry.paidAmount })));

    // console.log("Grouped Student Data:", groupedStudentData);
    // console.log("Grouped Customer Data:", groupedCustomerData);
    // console.log("Grouped Cashout Data:", groupedCashoutData);

    const calculateTotalAmount = (groupedData) => {
        return Object.values(groupedData).reduce((total, entries) => {
            return total + entries.reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
        }, 0);
    }

    // Calculate total amount for each type
    const totalStudentAmount = calculateTotalAmount(groupedStudentData);
    const totalCustomerAmount = calculateTotalAmount(groupedCustomerData);
    const totalCashoutAmount = calculateTotalAmount(groupedCashoutData);

    return (
        <div className='student-view-container'>
            {/* Bread Crumb */}
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/createCashIn" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Create
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Manage Reports</h2>
                    <div className="select-year">
                        <label style={{ color: "black", paddingRight: "10px" }}>Year</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ width: "80px", padding: "5px" }}>
                            {Array.from({ length: new Date().getFullYear() - 2015 }, (_, index) => new Date().getFullYear() - index).map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>


            <div className="dashbaord-cards">
                <div className="index-cards">
                    <div className="dash-card" id="employee-card">
                        <div className="dash-text">
                            <p style={{ fontWeight: "600" }}>Total Amount by Students</p>
                            <h4>Rs.{totalStudentAmount}</h4>
                        </div>
                        <div className="dash-icon">
                            <AssessmentIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>
                    <div className="dash-card" id="student-card">
                        <div className="dash-text">
                            <p style={{ fontWeight: "600" }}>Total Amount by Customers</p>
                            <h4>Rs.{totalCustomerAmount}</h4>
                        </div>
                        <div className="dash-icon">
                            <AssessmentIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>
                    <div className="dash-card" id="student-card">
                        <div className="dash-text">
                            <p style={{ fontWeight: "600" }}>Total Amount by CashIn</p>
                            <h4>Rs.{totalCustomerAmount + totalStudentAmount}</h4>
                        </div>
                        <div className="dash-icon">
                            <AssessmentIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>
                    <div className="dash-card" id="project-card">
                        <div className="dash-text">
                            <p style={{ fontWeight: "600" }}>Total Amount In Cash Out</p>
                            <h4>Rs.{totalCashoutAmount}</h4>
                        </div>
                        <div className="dash-icon">
                            <AssessmentIcon style={{ fontSize: "2.2rem" }} />
                        </div>
                    </div>


                </div>
            </div>
        </div>


    );
};


export default CashInReports;
