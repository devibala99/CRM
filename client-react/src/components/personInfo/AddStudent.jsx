/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createStudent } from '../features/studentsSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import "./addStudent.css"
import { Link } from 'react-router-dom';
import { fetchCourse } from "../features/courseSlice";
import { getStaffDetails } from '../features/staffSlice';

const AddStudent = () => {
    const { studentId: initialStudentId } = useParams();
    const dispatch = useDispatch();
    const courseEntries = useSelector(state => state.courses.courseEntries);
    const staffDetails = useSelector(state => state.staffDetails.staffDetailEntries)
    useEffect(() => {
        const storedCourseEntries = localStorage.getItem('courseFields');
        dispatch(getStaffDetails());
        if (storedCourseEntries) {
            dispatch(fetchCourse());
        }
    }, [dispatch]);
    // to avoid undefined issue in the studentId  and get the value from localstorage
    const initialStudentIdLocal = localStorage.getItem('currentStudentId') || initialStudentId || `KIT-001`;
    const initialStudentIdText = initialStudentIdLocal ? initialStudentIdLocal.split("-")[0] : initialStudentId.split("-")[0] || "KIT";
    const initalStudentIdNumber = parseInt(initialStudentIdLocal ? initialStudentIdLocal.split('-')[1] : initialStudentId.split('-')[1]) || 1001;

    const [currentStudentIdText, setCurrentStudentIdText] = useState(initialStudentIdText);
    const [currentStudentIdNumber, setCurrentStudentIdNumber] = useState(initalStudentIdNumber)

    const [selectedQualification, setSelectedQualification] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    // education qualification display 
    const [isSslc, setIsSslc] = useState(false);
    const [isHsc, setIsHsc] = useState(false);
    const [isDiploma, setIsDiploma] = useState(false);
    const [isUg, setIsUg] = useState(false);
    const [isPg, setIsPg] = useState(false);
    const [isPhd, setIsPhd] = useState(false);
    const [studentDetails, setStudentDetails] = useState({
        studentId: `${currentStudentIdText}-${currentStudentIdNumber}` || localStorage.getitem("currentStudentId") || 'Set Student Id In Master',
        firstName: '',
        lastName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        emailId: '',
        address: '',
        contactNumber1: '',
        contactNumber2: '',
        gender: '',
        maritalStatus: '',
        sslcPercentage: '',
        qualification: '',
        hscPercentage: '',
        diplomaPercentage: '',
        ugCollegeName: '',
        ugSpecialization: '',
        ugCgpa: '',
        ugYearOfPassing: '',
        pgCollegeName: '',
        pgSpecialization: '',
        pgCgpa: '',
        pgYearOfPassing: '',
        phdCollegeName: '',
        phdSpecialization: '',
        phdCgpa: '',
        phdYearOfPassing: '',
        workExperience: '',
        course: '',
        totalAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
        doj: "",
        studentStatus: '',
        studentImage: null,
        comments: ''
    });
    const handleCourseFees = (e) => {
        const selectedCourse = e.target.value;
        const selectedEntry = courseEntries.find(entry => entry.course === selectedCourse);
        console.log("selectedEntry", selectedEntry)
        if (selectedEntry) {
            setStudentDetails({
                ...studentDetails,
                course: selectedCourse,
                totalAmount: selectedEntry.courseFees
            });
        } else {
            setStudentDetails({
                ...studentDetails,
                course: selectedCourse,
                totalAmount: 0
            });
        }
        console.log(studentDetails.totalAmount)
    };
    // Function to handle input change for each field
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        let updatedStudentDetails = { ...studentDetails, [name]: value };

        if (name === "totalAmount" || name === "paidAmount") {
            const totalAmount = parseFloat(updatedStudentDetails.totalAmount || 0);
            const paidAmount = parseFloat(updatedStudentDetails.paidAmount || 0);
            updatedStudentDetails.remainingAmount = totalAmount - paidAmount;
        } else if (name === "studentImage") {
            updatedStudentDetails[name] = files[0];
        }

        setStudentDetails(updatedStudentDetails);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
    }
    const handleStudentSubmit = async () => {
        try {
            const formData = new FormData();

            for (const key in studentDetails) {
                formData.append(key, studentDetails[key]);
            }
            const resultAction = await dispatch(createStudent(formData));
            const response = await resultAction.payload;

            if (response && response._id) {
                setSnackbarOpen(true);
                setErrorSnackbarOpen(false);
                setSuccessMessage(true);
                setErrorMessage("");

                // update student id
                const nextStudentIdNumber = currentStudentIdNumber + 1;
                const fullStudentId = `${currentStudentIdText}-${nextStudentIdNumber}`;
                setCurrentStudentIdText(fullStudentId.split("-")[0]);
                setCurrentStudentIdNumber(nextStudentIdNumber);
                localStorage.setItem('currentStudentId', fullStudentId);

                setStudentDetails({
                    studentId: `${fullStudentId}` || localStorage.getitem("currentStudentId") || 'Set Student Id In Master',
                    firstName: '',
                    lastName: '',
                    fatherName: '',
                    motherName: '',
                    dateOfBirth: '',
                    emailId: '',
                    address: '',
                    contactNumber1: '',
                    contactNumber2: '',
                    gender: '',
                    maritalStatus: '',
                    sslcPercentage: '',
                    qualification: '',
                    hscPercentage: '',
                    diplomaPercentage: '',
                    ugCollegeName: '',
                    ugSpecialization: '',
                    ugCgpa: '',
                    ugYearOfPassing: '',
                    pgCollegeName: '',
                    pgSpecialization: '',
                    pgCgpa: '',
                    pgYearOfPassing: '',
                    phdCollegeName: '',
                    phdSpecialization: '',
                    phdCgpa: '',
                    phdYearOfPassing: '',
                    workExperience: '',
                    course: '',
                    totalAmount: 0,
                    paidAmount: 0,
                    remainingAmount: 0,
                    doj: "",
                    mentor: "",
                    studentStatus: '',
                    studentImage: null,
                    comments: ''
                })

            } else {
                setErrorMessage("Unexpected response received");
                if (response && response.error) {
                    setErrorMessage("Error occurred!!! " + response.error);
                } else {
                    setErrorMessage("Unexpected Error Occurred!!!");
                }

                setErrorSnackbarOpen(true);
                setSnackbarOpen(false);
                setSuccessMessage(false);
            }
        } catch (error) {
            setErrorMessage("Error occurred!!! " + error.message);
            setErrorSnackbarOpen(true);
            setSnackbarOpen(false);
            setSuccessMessage(false);
        }
    };

    const handleQualificationChange = (e) => {
        const selectedQualification = e.target.value;
        setSelectedQualification(selectedQualification);
        setStudentDetails({ ...studentDetails, qualification: selectedQualification });
        setIsSslc(false);
        setIsDiploma(false);
        setIsHsc(false);
        setIsUg(false);
        setIsPg(false);
        const splitQualification = selectedQualification.split(",");
        console.log(splitQualification, selectedQualification);

        splitQualification.forEach(qualification => {
            const trimmedQualification = qualification.trim();
            switch (trimmedQualification) {
                case 'SSLC':
                    setIsSslc(true);
                    break;
                case 'Diploma':
                    setIsDiploma(true);
                    break;
                case 'HSC':
                    setIsHsc(true);
                    break;
                case 'UG':
                    setIsUg(true);
                    break;
                case 'PG':
                    setIsPg(true);
                    break;
                case 'PhD':
                    setIsPhd(true);
                    break;
                default:
                    break;
            }
        });
    };


    return (
        <div className="student-container">
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/display-students`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Students List
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Register Student</h2>
                    <SidebarBreadcrumbs />
                </div>

            </div>
            {successMessage && (<Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Successfully created!
                </MuiAlert>

            </Snackbar>
            )}
            {errorMessage && (
                <Snackbar
                    open={errorSnackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseErrorSnackbar}
                >
                    <MuiAlert
                        onClose={handleCloseSnackbar}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </MuiAlert>
                </Snackbar>
            )}

            <div className="add-student_container">
                <form onSubmit={handleStudentSubmit} encType="multipart/form-data" className='studentForm'>
                    <div className="form-group">
                        <label htmlFor="studentId">      Student Id: <span>*</span></label>
                        <input type="text" id="studentId" name="studentId" value={studentDetails.studentId} onChange={(e) => setStudentDetails({ ...studentDetails, studentId: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="firstName" name="firstName" value={studentDetails.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="lastName" name="lastName" value={studentDetails.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fatherName">Father Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="fatherName" name="fatherName" value={studentDetails.fatherName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="motherName">Mother Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="motherName" name="motherName" value={studentDetails.motherName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date Of Birth: <span style={{ color: "Red" }}>*</span></label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={studentDetails.dateOfBirth} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailId">Email Id: <span style={{ color: "Red" }}>*</span></label>
                        <input type="email" id="emailId" name="emailId" value={studentDetails.emailId} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address: <span style={{ color: "Red" }}>*</span></label>
                        <textarea id="address" name="address" value={studentDetails.address} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber1">Contact Number: <span style={{ color: "Red" }}>*</span></label>
                        <input type="tel" id="contactNumber1" name="contactNumber1" pattern="[0-9]{10}" value={studentDetails.contactNumber1} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber2">Alternate Number:</label>
                        <input type="tel" id="contactNumber2" name="contactNumber2" pattern="[0-9]{10}" value={studentDetails.contactNumber2} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Gender: <span style={{ color: "Red" }}>*</span></label>
                        <div className="radio-row" style={{ display: "flex" }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    value="male"
                                    checked={studentDetails.gender === 'male'}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, gender: e.target.value })}
                                />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    value="female"
                                    checked={studentDetails.gender === 'female'}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, gender: e.target.value })}
                                />
                                <label htmlFor="female">Female</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="others"
                                    name="gender"
                                    value="others"
                                    checked={studentDetails.gender === 'others'}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, gender: e.target.value })}
                                />
                                <label htmlFor="others">Others</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Marital Status: <span style={{ color: "Red" }}>*</span></label>
                        <div className="radio-row">
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="single"
                                    name="maritalStatus"
                                    value="Single"
                                    checked={studentDetails.maritalStatus === 'Single'}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, maritalStatus: e.target.value })}
                                />
                                <label htmlFor="single">Single</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="married"
                                    name="maritalStatus"
                                    value="Married"
                                    checked={studentDetails.maritalStatus === 'Married'}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, maritalStatus: e.target.value })}
                                />
                                <label htmlFor="married">Married</label>
                            </div>

                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="qualification">Qualification: <span style={{ color: "Red" }}>*</span></label>
                        <select
                            id="qualification"
                            name="qualification"
                            value={studentDetails.qualification}
                            onChange={handleQualificationChange}
                        >
                            <option value="">Select Qualification</option>
                            <option value="SSLC">SSLC</option>
                            <option value="SSLC, HSC">SSLC, HSC</option>
                            <option value="SSLC, Diploma, HSC">SSLC, Diploma, HSC</option>
                            <option value="SSLC, HSC, Diploma">SSLC, HSC, Diploma</option>
                            <option value="SSLC, HSC, UG">SSLC, HSC, UG</option>
                            <option value="SSLC, Diploma, HSC, UG">SSLC, Diploma, HSC, UG</option>
                            <option value="SSLC, HSC, UG, PG">SSLC, HSC, UG, PG</option>
                            <option value="SSLC, Diploma, HSC, UG, PG">SSLC, Diploma, HSC, UG, PG</option>
                            <option value="SSLC, HSC, UG, PG, PhD">SSLC, HSC, UG, PG, PhD</option>
                            <option value="SSLC, HSC, Diploma, UG, PG, PhD">SSLC, HSC, Diploma, UG, PG, PhD</option>
                        </select>
                    </div>
                    {
                        isSslc && (
                            <div className="form-group">
                                <label htmlFor="sslcPercentage">SSLC Percentage: <span style={{ color: "Red" }}>*</span></label>
                                <input
                                    type="text"
                                    id="sslcPercentage"
                                    name="sslcPercentage"
                                    value={studentDetails.sslcPercentage}
                                    onChange={(e) => setStudentDetails({ ...studentDetails, sslcPercentage: e.target.value })}
                                />
                            </div>
                        )
                    }
                    {
                        isHsc && (
                            <div className="form-group">
                                <label htmlFor="hscPercentage">HSC Percentage:</label>
                                <input
                                    type="text"
                                    id="hscPercentage"
                                    name="hscPercentage"
                                    value={studentDetails.hscPercentage} onChange={(e) => setStudentDetails({ ...studentDetails, hscPercentage: e.target.value })}
                                />
                            </div>
                        )
                    }
                    {
                        isDiploma && (
                            <div className="form-group">
                                <label htmlFor="diplomaPercentage">Diploma Percentage:</label>
                                <input
                                    type="text"
                                    id="diplomaPercentage"
                                    name="diplomaPercentage"
                                    value={studentDetails.diplomaPercentage} onChange={(e) => setStudentDetails({ ...studentDetails, diplomaPercentage: e.target.value })}
                                />
                            </div>
                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugCollegeName">College Name (UG):</label>
                                <input
                                    type="text"
                                    id="ugCollegeName"
                                    name="ugCollegeName"
                                    value={studentDetails.ugCollegeName} onChange={(e) => setStudentDetails({ ...studentDetails, ugCollegeName: e.target.value })}
                                />
                            </div>

                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugSpecialization">UG Specialization:</label>
                                <input
                                    type="text"
                                    id="ugSpecialization"
                                    name="ugSpecialization"
                                    value={studentDetails.ugSpecialization}
                                    onChange={handleInputChange}
                                />
                            </div>

                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugCgpa">UG CGPA:</label>
                                <input
                                    type="text"
                                    id="ugCgpa"
                                    name="ugCgpa"
                                    value={studentDetails.ugCgpa}
                                    onChange={handleInputChange}
                                />
                            </div>

                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugYearOfPassing">UG Year of Passing:</label>
                                <select
                                    id="ugYearOfPassing"
                                    name="ugYearOfPassing"
                                    value={studentDetails.ugYearOfPassing}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 51 }, (_, i) => 2000 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgCollegeName">College Name (PG):</label>
                                <input
                                    type="text"
                                    id="pgCollegeName"
                                    name="pgCollegeName"
                                    value={studentDetails.pgCollegeName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgSpecialization">PG Specialization:</label>
                                <input
                                    type="text"
                                    id="pgSpecialization"
                                    name="pgSpecialization"
                                    value={studentDetails.pgSpecialization}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgCgpa">PG CGPA:</label>
                                <input
                                    type="text"
                                    id="pgCgpa"
                                    name="pgCgpa"
                                    value={studentDetails.pgCgpa}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgYearOfPassing">PG Year of Passing:</label>
                                <select
                                    id="pgYearOfPassing"
                                    name="pgYearOfPassing"
                                    value={studentDetails.pgYearOfPassing}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 51 }, (_, i) => 2000 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdCollegeName">College Name (PhD):</label>
                                <input
                                    type="text"
                                    id="phdCollegeName"
                                    name="phdCollegeName"
                                    value={studentDetails.phdCollegeName}
                                    onChange={handleInputChange}

                                />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdSpecialization">PhD Specialization:</label>
                                <input
                                    type="text"
                                    id="phdSpecialization"
                                    name="phdSpecialization"
                                    value={studentDetails.phdSpecialization}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdCgpa">PhD CGPA:</label>
                                <input
                                    type="text"
                                    id="phdCgpa"
                                    name="phdCgpa"
                                    value={studentDetails.phdCgpa}
                                    onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdYearOfPassing">PhD Year of Passing:</label>
                                <select id="phdYearOfPassing" name="phdYearOfPassing" value={studentDetails.phdYearOfPassing} onChange={handleInputChange} >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 51 }, (_, i) => 2000 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        )
                    }

                    <div className="form-group">
                        <label htmlFor="workExperience">Work Experience:</label>
                        <input
                            type="text"
                            id="workExperience"
                            name="workExperience"
                            value={studentDetails.workExperience}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="course">Course: <span style={{ color: "Red" }}>*</span></label>
                        <select id="course" name="course" value={studentDetails.course} onChange={handleCourseFees}>
                            <option value="">Select Course </option>
                            {courseEntries.map(entry => (
                                <option key={entry.course} value={entry.course}>{entry.course}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalAmount">Total Amount: <span style={{ color: "Red" }}>*</span></label>
                        <input
                            type="number"
                            id="totalAmount"
                            name="totalAmount"
                            value={studentDetails.totalAmount || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="paidAmount">Paid Amount: <span style={{ color: "Red" }}>*</span></label>
                        <input
                            type="number"
                            id="paidAmount"
                            name="paidAmount"
                            value={studentDetails.paidAmount}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="remainingAmount">Remaining Amount:</label>
                        <input
                            type="number"
                            id="remainingAmount"
                            name="remainingAmount"
                            value={studentDetails.remainingAmount}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mentor">Mentor:</label>
                        <select id="mentor" name="mentor" value={studentDetails.mentor} onChange={handleInputChange}>
                            <option value="">Select Mentor</option>
                            {staffDetails.map(staff => (
                                <option key={staff._id} value={staff.staffName}>
                                    {staff.staffName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="doj">Date Of Joining: <span style={{ color: "Red" }}>*</span></label>
                        <input type="date" id="doj" name="doj" value={studentDetails.doj} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentStatus">Student Status:</label>
                        <select id="studentStatus" name="studentStatus" value={studentDetails.studentStatus} onChange={handleInputChange}>
                            <option>Select Student Status</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="studentImage">Student Image:<span style={{ color: "Red" }}>*</span></label>
                        <input type="file" id="studentImage" name="studentImage" accept=".jpg, .jpeg, .png" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Remarks:</label>
                        <textarea id="comments" name="comments" value={studentDetails.comments} onChange={handleInputChange} />
                    </div>

                    <div className="full-width">
                        <div className="btn-submit">
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default AddStudent;
