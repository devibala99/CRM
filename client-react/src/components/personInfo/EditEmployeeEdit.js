/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { updateEmployee } from '../features/employeesSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import "./addStudent.css"
const EditEmployeeModal = ({ selectedEmployee, onClose }) => {
    const [editedEmployee, setEditedEmployee] = useState(selectedEmployee);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const dispatch = useDispatch();
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
    if (!selectedEmployee) {
        return null;
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        console.log(year, month, day);
        return `${year}-${month}-${day}`;
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee(prevState => ({
            ...prevState,
            [name]: value,
            annualSalary: name === "salary" ? (parseInt(value) * 12) : prevState.annualSalary,

        }));
    };
    const handleImageChange = (e) => {
        setEditedEmployee({ ...editedEmployee, employeeImage: e.target.files[0] });
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };
    console.log(editedEmployee, "EditedStudent");

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('employeeId', editedEmployee.employeeId);
        formData.append('firstName', editedEmployee.firstName);
        formData.append('lastName', editedEmployee.lastName);
        formData.append('fatherName', editedEmployee.fatherName);
        formData.append('motherName', editedEmployee.motherName);
        formData.append('dateOfBirth', editedEmployee.dateOfBirth);
        formData.append('emailId', editedEmployee.emailId);
        formData.append('address', editedEmployee.address);
        formData.append('contactNumber1', editedEmployee.contactNumber1);
        formData.append('contactNumber2', editedEmployee.contactNumber2);
        formData.append('gender', editedEmployee.gender);
        formData.append('maritalStatus', editedEmployee.maritalStatus);
        formData.append('sslcPercentage', editedEmployee.sslcPercentage);
        formData.append('qualification', editedEmployee.qualification);
        formData.append('hscPercentage', editedEmployee.hscPercentage);
        formData.append('diplomaPercentage', editedEmployee.diplomaPercentage);
        formData.append('ugCollegeName', editedEmployee.ugCollegeName);
        formData.append('ugSpecialization', editedEmployee.ugSpecialization);
        formData.append('ugCgpa', editedEmployee.ugCgpa);
        formData.append('ugYearOfPassing', editedEmployee.ugYearOfPassing);
        formData.append('pgCollegeName', editedEmployee.pgCollegeName);
        formData.append('pgSpecialization', editedEmployee.pgSpecialization);
        formData.append('pgCgpa', editedEmployee.pgCgpa);
        formData.append('pgYearOfPassing', editedEmployee.pgYearOfPassing);
        formData.append('phdCollegeName', editedEmployee.phdCollegeName);
        formData.append('phdSpecialization', editedEmployee.phdSpecialization);
        formData.append('phdCgpa', editedEmployee.phdCgpa);
        formData.append('phdYearOfPassing', editedEmployee.phdYearOfPassing);
        formData.append('workExperience', editedEmployee.workExperience);
        formData.append('designation', editedEmployee.designation);
        formData.append('salary', editedEmployee.salary);
        formData.append('annualSalary', editedEmployee.annualSalary);
        formData.append('doj', editedEmployee.doj);
        formData.append('dor', editedEmployee.dor);
        formData.append('isStaff', editedEmployee.isStaff);
        formData.append('staffDoj', editedEmployee.staffDoj);
        formData.append('aadharNumber', editedEmployee.aadharNumber);
        formData.append('panNumber', editedEmployee.panNumber);
        formData.append('bankAccountNumber', editedEmployee.bankAccountNumber);
        formData.append('employeeImage', editedEmployee.employeeImage);
        formData.append('employeeType', editedEmployee.employeeType);
        formData.append('comments', editedEmployee.comments);

        try {
            await dispatch(updateEmployee({ id: selectedEmployee.id, data: formData }));
            setSnackbarOpen(true);
            setErrorSnackbarOpen(false);
            setSuccessMessage(true);
            setErrorMessage("");
            setEditedEmployee({
                employeeId: '',
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
            onClose();
            window.location.reload();
        }
        catch (error) {
            setErrorSnackbarOpen(true);
            setSnackbarOpen(false);
            setSuccessMessage(false);
            setErrorMessage("Error occurred!!!");
        }

    };
    const handleQualificationChange = (e) => {
        const selectedQualification = e.target.value;
        setSelectedQualification(selectedQualification);
        setEditedEmployee(prevState => ({
            ...prevState,
            qualification: selectedQualification
        }));
        setIsSslc(false);
        setIsDiploma(false);
        setIsHsc(false);
        setIsUg(false);
        setIsPg(false);
        setIsPhd(false);
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
        <div className="update-employee__modal">
            <div className='employee-edit-modal'>
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
                        Successfully Updated!
                    </MuiAlert>

                </Snackbar>
                )}
                {
                    errorMessage && (<Snackbar
                        open={errorSnackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <MuiAlert
                            onClose={handleCloseSnackbar}
                            severity="success"
                            sx={{ width: '100%' }}
                        >
                            Error Occured !!!
                        </MuiAlert>

                    </Snackbar>
                    )
                }
                {/*<h2 style={{ paddingBottom: "2rem", color: "#2196f3" }}>Update Employee Information</h2>*/}
                <form onSubmit={handleUpdateSubmit} className='editedEmployee'>
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee ID:</label>
                        <input type="text" id="employeeId" name="employeeId" value={editedEmployee.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={editedEmployee.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={editedEmployee.lastName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fatherName">Father's Name:</label>
                        <input type="text" id="fatherName" name="fatherName" value={editedEmployee.fatherName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="motherName">Mother's Name:</label>
                        <input type="text" id="motherName" name="motherName" value={editedEmployee.motherName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth:</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formatDate(editedEmployee.dateOfBirth)} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailId">Email ID:</label>
                        <input type="email" id="emailId" name="emailId" value={editedEmployee.emailId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <textarea id="address" name="address" value={editedEmployee.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber1">Mobile Number:</label>
                        <input type="tel" id="contactNumber1" name="contactNumber1" value={editedEmployee.contactNumber1} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber2">Alternative Number:</label>
                        <input type="tel" id="contactNumber2" name="contactNumber2" value={editedEmployee.contactNumber2} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <div style={{ display: "flex" }}>
                            <label><input type="radio" name="gender" value="male" checked={editedEmployee.gender === 'male'} onChange={handleInputChange} /> Male</label>
                            <label><input type="radio" name="gender" value="female" checked={editedEmployee.gender === 'female'} onChange={handleInputChange} /> Female</label>
                            <label><input type="radio" name="gender" value="others" checked={editedEmployee.gender === 'others'} onChange={handleInputChange} /> Others</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Marital Status:</label>
                        <div style={{ display: "flex" }}>
                            <label><input type="radio" name="maritalStatus" value="Single" checked={editedEmployee.maritalStatus === 'Single'} onChange={handleInputChange} />Single</label>

                            <label><input type="radio" name="maritalStatus" value="Married" checked={editedEmployee.maritalStatus === 'Married'} onChange={handleInputChange} />Married</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="qualification">Qualification:</label>
                        <select
                            id="qualification"
                            name="qualification"
                            value={editedEmployee.qualification}
                            onChange={handleQualificationChange}                   >
                            <option value="">Select Qualification</option>
                            <option value="SSLC">SSLC</option>
                            <option value="SSLC, HSC">SSLC, HSC</option>
                            <option value="SSLC, Diploma, HSC">SSL, Diploma, HSC</option>
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
                                <label htmlFor="sslc">SSLC Percentage:</label>
                                <input type="text" id="sslc" name="sslcPercentage" value={editedEmployee.sslcPercentage} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isHsc && (
                            <div className="form-group">
                                <label htmlFor="hsc">HSC Percentage:</label>
                                <input type="text" id="hsc" name="hscPercentage" value={editedEmployee.hscPercentage} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isDiploma && (
                            <div className="form-group">
                                <label htmlFor="diplomaPercentage">Diploma Percentage:</label>
                                <input type="text" id="diplomaPercentage" name="diplomaPercentage" value={editedEmployee.diplomaPercentage} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugCollegeName">UG College Name:</label>
                                <input type="text" id="ugCollegeName" name="ugCollegeName" value={editedEmployee.ugCollegeName} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugSpecialization">UG Specialization:</label>
                                <input type="text" id="ugSpecialization" name="ugSpecialization" value={editedEmployee.ugSpecialization} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isUg && (

                            <div className="form-group">
                                <label htmlFor="ugCgpa">UG CGPA:</label>
                                <input type="text" id="ugCgpa" name="ugCgpa" value={editedEmployee.ugCgpa} onChange={handleInputChange} />
                            </div>

                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugYearOfPassing">UG Year of Passing:</label>
                                <select id="ugYearOfPassing" name="ugYearOfPassing" value={editedEmployee.ugYearOfPassing} onChange={handleInputChange} >
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
                                <label htmlFor="pgCollegeName">PG College Name:</label>
                                <input type="text" id="pgCollegeName" name="pgCollegeName" value={editedEmployee.pgCollegeName} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPg && (

                            <div className="form-group">
                                <label htmlFor="pgSpecialization">PG Specialization:</label>
                                <input type="text" id="pgSpecialization" name="pgSpecialization" value={editedEmployee.pgSpecialization} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgCgpa">PG CGPA:</label>
                                <input type="text" id="pgCgpa" name="pgCgpa" value={editedEmployee.pgCgpa} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgYearOfPassing">PG Year of Passing:</label>
                                <select id="pgYearOfPassing" name="pgYearOfPassing" value={editedEmployee.pgYearOfPassing} onChange={handleInputChange} >
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
                                <label htmlFor="phdCollegeName">PhD College Name:</label>
                                <input type="text" id="phdCollegeName" name="phdCollegeName" value={editedEmployee.phdCollegeName} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdSpecialization">PhD Specialization:</label>
                                <input type="text" id="phdSpecialization" name="phdSpecialization" value={editedEmployee.phdSpecialization} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdCgpa">PhD CGPA:</label>
                                <input type="text" id="phdCgpa" name="phdCgpa" value={editedEmployee.phdCgpa} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdYearOfPassing">PhD Year of Passing:</label>
                                <select id="phdYearOfPassing" name="phdYearOfPassing" value={editedEmployee.phdYearOfPassing} onChange={handleInputChange} >
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
                        <input type="text" id="workExperience" name="workExperience" value={editedEmployee.workExperience} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="designation">Designation:</label>
                        <input type="text" id="designation" name="designation" value={editedEmployee.designation} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary">Salary:</label>
                        <input type="number" id="salary" name="salary" value={editedEmployee.salary} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="annualSalary">Annual Salary:</label>
                        <input type="number" id="annualSalary" name="annualSalary" value={editedEmployee.annualSalary} onChange={handleInputChange} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="doj">Date of Joining:</label>
                        <input type="date" id="doj" name="doj" value={formatDate(editedEmployee.doj)} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dor">Date of Relieving:</label>
                        <input type="date" id="dor" name="dor" value={formatDate(editedEmployee.dor)} onChange={handleInputChange} />
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
                                    checked={editedEmployee.isStaff === "Yes"}
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
                                    checked={editedEmployee.isStaff === "No"}
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
                            value={editedEmployee.staffDoj}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="workExperience">Work Experience:</label>
                        <input type="text" id="workExperience" name="workExperience" value={editedEmployee.workExperience} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aadharNumber">Aadhar Number:</label>
                        <input type="text" id="aadharNumber" name="aadharNumber" value={editedEmployee.aadharNumber} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="panNumber">PAN Number:</label>
                        <input type="text" id="panNumber" name="panNumber" value={editedEmployee.panNumber} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bankAccountNumber">Account Number:</label>
                        <input type="text" id="bankAccountNumber" name="bankAccountNumber" value={editedEmployee.bankAccountNumber} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="employeeImage">Upload Photo:</label>
                        <input type="file" id="employeeImage" name="employeeImage" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="employeeType">Employee Type:</label>
                        <select
                            id="employeeType"
                            name="employeeType"
                            value={editedEmployee.employeeType}
                            onChange={handleInputChange}
                        >   <option value="">Select Employee Type</option>
                            <option value="Current Employee">Current Employee</option>
                            <option value="Old Employee">Old Employee</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Remarks:</label>
                        <textarea id="comments" name="comments" value={editedEmployee.comments}
                            onChange={handleInputChange} />
                    </div>

                    <div className="full-width">
                        <div className="btn-submit" style={{ paddingBottom: "3rem" }}>
                            <ButtonGroup
                                disableElevation
                                variant="contained"
                                aria-label="Disabled elevation buttons"
                            >
                                <Button type="Submit">Save</Button>
                                <Button onClick={onClose}>Close</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeModal;
