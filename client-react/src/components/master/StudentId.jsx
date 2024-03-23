import React, { useState, useEffect } from 'react'
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { showStudents } from "../features/studentsSlice";
import { useSelector, useDispatch } from 'react-redux';
const StudentId = () => {
    const [studentId, setStudentId] = useState(`KIT-10001`);

    const studentList = useSelector(state => state.students.entries);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showStudents());
    }, [dispatch]);
    useEffect(() => {
        const currentStudentId = localStorage.getItem('currentStudentId');
        const lastStudentId = studentList[studentList.length - 1];
        if (lastStudentId) {
            setStudentId(`${lastStudentId.studentId}`)
        }
        if (currentStudentId) {
            setStudentId(`${currentStudentId}`);
        }
    }, [studentList]);

    const handleIdInput = (e) => {
        e.stopPropagation();
        setStudentId(e.target.value);
    }

    const handleSetStudentId = (e) => {
        e.stopPropagation();
        const studentIdText = studentId.split("-")[0];
        const studentIdValue = parseInt(studentId.split("-")[1]);
        localStorage.setItem("currentStudentId", `${studentIdText}-${studentIdValue}`);
        setStudentId(`${studentIdText}-${studentIdValue}`);

        navigate(`/home/new-student/${studentIdText}-${studentIdValue}`);
    }
    return (
        <div className="student-container">

            <div className="bread-crumb" >
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/new-student/${localStorage.getItem("currentStudentId")}`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Student
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Set Student ID</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>

            <div className="input-id-content" style={{ marginTop: "2rem" }}>
                <div className="form-group" style={{ padding: "1rem" }}>
                    <label htmlFor="studentId">Student ID:</label>
                    <input type="text" id="studentId" name="studentId" value={studentId} onChange={(e) => handleIdInput(e)} min="0" required />
                </div>
            </div>
            <div className="btn-class" style={{ paddingBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button onClick={(e) => handleSetStudentId(e)} style={{ backgroundColor: "#2196f3", color: "white", fontSize: "1rem", width: "140px", height: "40px", border: "none", outline: "none", borderRadius: "5px" }}>Set ID</button>
            </div>

        </div>
    )
}

export default StudentId
