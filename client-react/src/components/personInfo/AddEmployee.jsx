/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { showEmployees, createEmployee } from '../features/employeesSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
// import { createStaffDetail } from '../features/staffSlice';

import "./addStudent.css"
const AddEmployee = () => {

    const { employeeId: initialEmployeeId } = useParams();
    const employees = useSelector(state => state.employees.employeeEntries);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showEmployees());
    }, [dispatch]);

    // employee id from localstorage
    const [initialEmployeeIdLocal, setInitialEmployeeIdLocal] = useState(() => {
        const localStorageValue = localStorage.getItem("currentEmployeeId");
        return localStorageValue;
    });

    // useEffect to update initialEmployeeIdLocal if necessary
    useEffect(() => {
        // If employees array is not empty, set initialEmployeeIdLocal to the last employee's ID
        if (employees.length > 0) {
            const lastEmployee = employees[employees.length - 1];
            const lastEmployeeId = lastEmployee.employeeId;
            setInitialEmployeeIdLocal(lastEmployeeId);
        } else {
            // If employees array is empty, fall back to the value from localStorage
            const localStorageValue = localStorage.getItem("currentEmployeeId");
            setInitialEmployeeIdLocal(localStorageValue);
        }
    }, [employees]);

    const initialEmployeeIdText = initialEmployeeIdLocal ? initialEmployeeIdLocal.split("-")[0] : "EMP";
    const initialEmployeeNumber = initialEmployeeIdLocal ? parseInt(initialEmployeeIdLocal.split("-")[1]) : 10001;

    const [currentEmployeeIdText, setCurrentEmployeeIdText] = useState(initialEmployeeIdText);
    const [currentEmployeeIdNumber, setCurrentEmployeeIdNumber] = useState(initialEmployeeNumber);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    // education qualification display 
    const [selectedQualification, setSelectedQualification] = useState('');
    const [isSslc, setIsSslc] = useState(false);
    const [isHsc, setIsHsc] = useState(false);
    const [isDiploma, setIsDiploma] = useState(false);
    const [isUg, setIsUg] = useState(false);
    const [isPg, setIsPg] = useState(false);
    const [isPhd, setIsPhd] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        employeeId: `${currentEmployeeIdText}-${currentEmployeeIdNumber}` || localStorage.getItem("currentEmployeeId") || "Set Employee Id In Master",
        firstName: "",
        lastName: "",
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
        designation: '',
        salary: '',
        annualSalary: '',
        doj: '',
        dor: '',
        isStaff: "",
        staffDoj: "",
        aadharNumber: '',
        panNumber: '',
        bankAccountNumber: '',
        employeeImage: null,
        employeeType: '',
        comments: '',

    });
    useEffect(() => {
        if (initialEmployeeIdLocal) {
            const lastNumber = parseInt(initialEmployeeIdLocal.split("-")[1]);
            const newNumber = lastNumber + 1;
            const newEmployeeId = `EMP-${newNumber}`;
            localStorage.setItem("currentEmployeeId", newEmployeeId);
            setEmployeeData(prevData => ({
                ...prevData,
                employeeId: newEmployeeId
            }));
        } else {
            // If initialEmployeeIdLocal is not available, fallback to localStorage
            const localStorageValue = localStorage.getItem("currentEmployeeId");
            setEmployeeData(prevData => ({
                ...prevData,
                employeeId: localStorageValue || "Set Employee Id In Master"
            }));
        }
    }, [initialEmployeeIdLocal]);
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

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        let updatedEmployeeDetails = { ...employeeData, [name]: value };

        if (name === "salary") {
            const salary = parseFloat(value || 0);
            updatedEmployeeDetails.annualSalary = 12 * salary;
        }
        else if (name === "employeeImage") {
            updatedEmployeeDetails[name] = files[0];
        }

        setEmployeeData(updatedEmployeeDetails);
    };

    const handleEmployeeSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if there are employees in the database
            if (employees.length > 0) {
                const contactNumberExists = employees.some(employee => employee.contactNumber1 === employeeData.contactNumber1);
                if (contactNumberExists) {
                    alert("Contact number already exists in the database. Please choose a different one.");
                    return; // Stop further execution if contact number exists
                }
            }

            const formData = new FormData();
            for (const key in employeeData) {
                formData.append(key, employeeData[key]);
            }

            const resultAction = await dispatch(createEmployee(formData));
            const response = await resultAction.payload;

            if (response && response._id) {
                setSnackbarOpen(true);
                setErrorSnackbarOpen(false);
                setSuccessMessage(true);
                setErrorMessage("");

                // Update employee id
                const nextEmployeeIdNumber = currentEmployeeIdNumber + 1;
                const fullEmployeeId = `${currentEmployeeIdText}-${nextEmployeeIdNumber}`;
                setCurrentEmployeeIdText(fullEmployeeId.split("-")[0]);
                setCurrentEmployeeIdNumber(nextEmployeeIdNumber);
                localStorage.setItem('currentEmployeeId', fullEmployeeId);

                // If employee is marked as staff, create staff detail entry
                // if (employeeData.isStaff === "Yes") {
                //     const updateDetails = {
                //         staffName: `${employeeData.firstName} ${employeeData.lastName}`,
                //         staffDoj: employeeData.staffDoj,
                //     };
                //     dispatch(createStaffDetail(updateDetails));
                // }

                // Reset form fields after successful submission
                setEmployeeData(prevEmployeeData => ({
                    ...prevEmployeeData,
                    employeeId: fullEmployeeId || localStorage.getItem("currentEmployeeId") || "Set Employee Id In Master",
                    firstName: "",
                    lastName: "",
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
                    designation: '',
                    salary: '',
                    annualSalary: '',
                    doj: '',
                    dor: '',
                    isStaff: "",
                    staffDoj: "",
                    aadharNumber: '',
                    panNumber: '',
                    bankAccountNumber: '',
                    employeeImage: null,
                    employeeType: '',
                    comments: '',
                }));
            } else {
                setErrorMessage("Unexpected response received");
                if (response && response.error) {
                    setErrorMessage("Error occurred!!! " + response.error);
                } else {
                    setErrorMessage("Unexpected Error Occurred, Email Should be Unique, Select Radio Buttons Properly and Enter All The Fields!!!");
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
        setEmployeeData({ ...employeeData, qualification: selectedQualification });
        setIsSslc(false);
        setIsDiploma(false);
        setIsHsc(false);
        setIsUg(false);
        setIsPg(false);
        const splitQualification = selectedQualification.split(",");
        // console.log(splitQualification, selectedQualification);

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
        <div className="employee-container">
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/display-employees`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Employees List
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Register Employee</h2>
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

            <div className="add-employee_container">
                <form onSubmit={handleEmployeeSubmit} className='employeeForm' encType="multipart/form-data" >
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee Id: <span>*</span></label>
                        <input type="text" id="employeeId" name="employeeId" value={employeeData.employeeId} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="firstName" name="firstName" value={employeeData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="lastName" name="lastName" value={employeeData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fatherName">Father Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="fatherName" name="fatherName" value={employeeData.fatherName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="motherName">Mother Name: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="motherName" name="motherName" value={employeeData.motherName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date Of Birth: <span style={{ color: "Red" }}>*</span></label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={employeeData.dateOfBirth} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailId">Email Id: <span style={{ color: "Red" }}>*</span></label>
                        <input type="email" id="emailId" name="emailId" value={employeeData.emailId} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address: <span style={{ color: "Red" }}>*</span></label>
                        <textarea id="address" name="address" value={employeeData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber1">Contact Number: <span style={{ color: "Red" }}>*</span></label>
                        <input type="text" id="contactNumber1" name="contactNumber1" minLength={10} maxLength={10} value={employeeData.contactNumber1} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber2">Alternate Number:</label>
                        <input type="text" id="contactNumber2" name="contactNumber2" minLength={10} maxLength={10} value={employeeData.contactNumber2} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Gender: <span style={{ color: "Red" }}>*</span></label>
                        <div className="radio-row" style={{ display: "flex", width: "100%" }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    value="male"
                                    checked={employeeData.gender === 'male'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    value="female"
                                    checked={employeeData.gender === 'female'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="female">Female</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="others"
                                    name="gender"
                                    value="others"
                                    checked={employeeData.gender === 'others'}
                                    onChange={(e) => setEmployeeData({ ...employeeData, gender: e.target.value })}
                                />
                                <label htmlFor="others">Others</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Marital Status: <span style={{ color: "Red" }}>*</span></label>
                        <div className="radio-row" style={{ display: "flex", width: "100%" }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="unmarried"
                                    name="maritalStatus"
                                    value="Single"
                                    checked={employeeData.maritalStatus === 'Single'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="married">Single</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="married"
                                    name="maritalStatus"
                                    value="Married"
                                    checked={employeeData.maritalStatus === 'Married'}
                                    onChange={handleInputChange}
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
                            value={employeeData.qualification}
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
                                    value={employeeData.sslcPercentage}
                                    onChange={(e) => setEmployeeData({ ...employeeData, sslcPercentage: e.target.value })}
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
                                    value={employeeData.hscPercentage} onChange={(e) => setEmployeeData({ ...employeeData, hscPercentage: e.target.value })}
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
                                    value={employeeData.diplomaPercentage} onChange={(e) => setEmployeeData({ ...employeeData, diplomaPercentage: e.target.value })}
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
                                    value={employeeData.ugCollegeName} onChange={(e) => setEmployeeData({ ...employeeData, ugCollegeName: e.target.value })}
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
                                    value={employeeData.ugSpecialization}
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
                                    value={employeeData.ugCgpa}
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
                                    value={employeeData.ugYearOfPassing}
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
                                    value={employeeData.pgCollegeName}
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
                                    value={employeeData.pgSpecialization}
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
                                    value={employeeData.pgCgpa}
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
                                    value={employeeData.pgYearOfPassing}
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
                                    value={employeeData.phdCollegeName}
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
                                    value={employeeData.phdSpecialization}
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
                                    value={employeeData.phdCgpa}
                                    onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdYearOfPassing">PhD Year of Passing:</label>
                                <select id="phdYearOfPassing" name="phdYearOfPassing" value={employeeData.phdYearOfPassing} onChange={handleInputChange} >
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
                            value={employeeData.workExperience}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="designation">Designation:</label>
                        <input type="text" id="designation" name="designation" value={employeeData.designation}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary">Salary:</label>
                        <input type="Number" id="salary" name="salary" value={employeeData.salary}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="annualSalary">Annual Salary:</label>
                        <input type="Number" id="annualSalary" name="annualSalary" value={employeeData.annualSalary}
                            onChange={handleInputChange} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="doj">Date of Joining:</label>
                        <input type="date" id="doj" name="doj" value={employeeData.doj}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dor">Date of Relieving:</label>
                        <input type="date" id="dor" name="dor" value={employeeData.dor}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Is Staff: <span style={{ color: "Red" }}>*</span></label>
                        <div className="radio-row" style={{ display: "flex", width: "100%" }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="yes"
                                    name="isStaff"
                                    value="Yes"
                                    checked={employeeData.isStaff === "Yes"}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="yes">Yes</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="no"
                                    name="isStaff"
                                    value="No"
                                    checked={employeeData.isStaff === "No"}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="staffDoj">Staff Date of Joining:</label>
                        <input
                            type="date"
                            id="staffDoj"
                            name="staffDoj"
                            value={employeeData.staffDoj}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="aadharNumber">Aadhar Number:</label>
                        <input type="text" id="aadharNumber" name="aadharNumber" value={employeeData.aadharNumber}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="panNumber">PAN Number:</label>
                        <input type="text" id="panNumber" name="panNumber" value={employeeData.panNumber}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bankAccountNumber">Account Number:</label>
                        <input type="text" id="bankAccountNumber" name="bankAccountNumber" value={employeeData.bankAccountNumber}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentType">Employee Type:</label>
                        <select id="studentType" name="studentType" value={employeeData.employeeType} onChange={handleInputChange}>
                            <option>Select Employee Type</option>
                            <option value="Current Employee">Current Employee</option>
                            <option value="Old Employee">Old Employee</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="eployeeImage">Upload Photo:</label>
                        <input type="file" id="employeeImage" name="employeeImage" accept="image/*" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Remarks:</label>
                        <textarea id="comments" name="comments" value={employeeData.comments}
                            onChange={handleInputChange} />
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

export default AddEmployee;
