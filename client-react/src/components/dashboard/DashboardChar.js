import React, { useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement } from "chart.js";
import "./dashboard.css"
import { showEmployees } from '../features/employeesSlice';
import { showStudents } from '../features/studentsSlice';
import { showClients } from "../features/clientSlice";
import { showInvoice } from '../features/invoiceSlice';
import { useDispatch, useSelector } from 'react-redux';
ChartJS.register(
    BarElement, Tooltip, Legend, CategoryScale, LinearScale, ArcElement
)
const DashboardChart = () => {

    const employees = useSelector(state => state.employees.employeeEntries) || [];
    const students = useSelector(state => state.students.entries) || [];
    const clients = useSelector(state => state.clients.clientEntries) || [];
    const invoiceDetails = useSelector(state => state.invoices.invoiceEntries) || []; // Update to invoiceEntries
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showEmployees());
        dispatch(showStudents());
        dispatch(showClients());
        dispatch(showInvoice());
    }, [dispatch]);

    const barData = {
        labels: ['January', "February", "March", "April", "May", "June"],
        datasets: [
            {
                label: "Rate",
                data: [3, 6, 4, 8, 2, 1],
                backgroundColor: "#2196f3",
                borderWidth: 0,
                borderColor: "black",
            }
        ]
    }

    const pieData = {
        labels: ['Students', 'Employee', 'Clients', 'Invoices'],
        datasets: [
            {
                data: [students.length, employees.length, clients.length, invoiceDetails.length],
                backgroundColor: ['#3ba2eb', '#ffd966', "#68DCE0", '#ff758d'],
                hoverBackgroundColor: ['#2ca0ef', '#FFCE56', "#68DCE0", '#ff758d'],
            },
        ],//#088f8f
    };

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }
    const pieOptions = {

        radius: '70%',
    }
    return (

        <div className="two-charts">
            <div className="barChart" style={{

                border: "1px solid rgba(159, 159, 159, 0.497)",
                borderRadius: "15px"
            }}>
                <h3 style={{ color: "var(--icon-color)" }}>Rate of Project</h3>
                <Bar
                    data={barData}
                    options={barOptions}
                >

                </Bar>
            </div>
            <div className="pieChart" style={{
                border: "1px solid rgba(159, 159, 159, 0.497)",
                borderRadius: "15px"
            }}>
                <h3 style={{ color: "var(--icon-color)" }}>Count</h3>
                <Pie data={pieData} options={pieOptions} />
            </div>
        </div>

    );
};

export default DashboardChart;
