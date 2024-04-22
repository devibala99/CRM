import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { showStudents } from '../features/studentsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse } from "../features/courseSlice";

ChartJS.register(
    ArcElement, Tooltip, Legend
);

const getRandomColor = (index) => {
    const colors = ['#3ba2eb', '#ffd966', "#68DCE0", '#ff758d', '#88d8b0', '#ff7f50'];
    return colors[index % colors.length];
};

const DashboardChart = () => {
    const studentsData = useSelector(state => state.students.entries) || [];
    const courses = useSelector(state => (state.courses.courseEntries) ?? []);
    const dispatch = useDispatch();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        dispatch(showStudents());
        dispatch(fetchCourse());
    }, [dispatch]);

    const filteredStudentsData = Array.isArray(studentsData) ? studentsData.filter(student => {
        const studentYear = new Date(student.doj).getFullYear();
        return studentYear === selectedYear;
    }) : [];

    let pieData = {};

    if (courses.length > 0 && filteredStudentsData.length > 0) {
        pieData = {
            labels: courses.map(data => data.course),
            datasets: [{
                data: courses.map(data => {
                    return filteredStudentsData.filter(student => student.course === data.course).length;
                }),
                backgroundColor: courses.map((data, index) => getRandomColor(index)),
                hoverBackgroundColor: courses.map((data, index) => getRandomColor(index)),
            }],
        };
    } else {
        // If no data is available--default empty data for the chart
        pieData = {
            labels: ['No Data Available'],
            datasets: [{
                data: [1],
                backgroundColor: ['rgba(0, 0, 0, 0)'],
                hoverBackgroundColor: ['rgba(0, 0, 0, 0)'],
            }],
        };
    }

    const pieOptions = {
        radius: '70%',
    };

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = 2016; year <= currentYear; year++) {
        years.push(year);
    }

    return (
        <div className="two-charts">
            <div className="pieChart" style={{
                border: "1px solid rgba(159, 159, 159, 0.497)",
                borderRadius: "15px"
            }}>
                <div className="flex-row" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <h3 style={{ color: "var(--icon-color)" }}>Number of Students per Course</h3>
                    <div style={{ marginLeft: "1rem" }}>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Pie data={pieData} options={pieOptions} />
            </div>
        </div>
    );
};

export default DashboardChart;
