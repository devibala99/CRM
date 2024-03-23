/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from '../features/studentsSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { fetchCourse } from "../features/courseSlice";
import { getStaffDetails } from '../features/staffSlice';

import "./addStudent.css"
const EditStudentModal = ({ selectedStudent, onClose }) => {
    const [editedStudent, setEditedStudent] = useState(selectedStudent);
    const courseEntries = useSelector(state => state.courses.courseEntries);
    const staffDetails = useSelector(state => state.staffDetails.staffDetailEntries)

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const dispatch = useDispatch();
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [courseFees, setCourseFees] = useState("");

    // education qualification display 
    const [selectedQualification, setSelectedQualification] = useState('');
    const [isSslc, setIsSslc] = useState(false);
    const [isHsc, setIsHsc] = useState(false);
    const [isDiploma, setIsDiploma] = useState(false);
    const [isUg, setIsUg] = useState(false);
    const [isPg, setIsPg] = useState(false);
    const [isPhd, setIsPhd] = useState(false);
    useEffect(() => {
        const storedCourseEntries = localStorage.getItem('courseFields');
        dispatch(getStaffDetails());
        if (storedCourseEntries) {
            dispatch(fetchCourse());
        }
    }, [dispatch])
    if (!selectedStudent) {
        return null;
    }

    const handleCourseFees = (e) => {
        const selectedCourse = e.target.value;
        const selectedEntry = courseEntries.find(entry => entry.course === selectedCourse);
        console.log("selectedEntry", selectedEntry)
        if (selectedEntry) {
            setEditedStudent({
                ...editedStudent,
                course: selectedCourse,
                totalAmount: selectedEntry.courseFees
            });
        } else {
            setEditedStudent({
                ...editedStudent,
                course: selectedCourse,
                totalAmount: 0
            });
        }
        console.log(editedStudent.totalAmount)
    };
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
        if (name === "totalAmount") {
            setEditedStudent(prevState => ({
                ...prevState,
                [name]: value,
                remainingAmount: (parseInt(value) || courseFees) - parseInt(prevState.paidAmount)
            }));
        } else {
            setEditedStudent(prevState => ({
                ...prevState,
                [name]: value,
                remainingAmount: name === 'paidAmount' ? (parseInt(prevState.totalAmount) || courseFees) - parseInt(value) : prevState.remainingAmount
            }));
        }
    };
    const handleImageChange = (e) => {
        setEditedStudent({ ...editedStudent, studentImage: e.target.files[0] });
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    console.log(editedStudent, "EditedStudent");
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('studentId', editedStudent.studentId);
        formData.append('firstName', editedStudent.firstName);
        formData.append('lastName', editedStudent.lastName);
        formData.append('fatherName', editedStudent.fatherName);
        formData.append('motherName', editedStudent.motherName);
        formData.append('dateOfBirth', editedStudent.dateOfBirth);
        formData.append('emailId', editedStudent.emailId);
        formData.append('address', editedStudent.address);
        formData.append('contactNumber1', editedStudent.contactNumber1);
        formData.append('contactNumber2', editedStudent.contactNumber2);
        formData.append('gender', editedStudent.gender);
        formData.append('maritalStatus', editedStudent.maritalStatus);
        formData.append('sslcPercentage', editedStudent.sslcPercentage);
        formData.append('qualification', editedStudent.qualification);
        formData.append('diplomaPercentage', editedStudent.diplomaPercentage);
        formData.append('hscPercentage', editedStudent.hscPercentage);
        formData.append('ugCollegeName', editedStudent.ugCollegeName);
        formData.append('ugSpecialization', editedStudent.ugSpecialization);
        formData.append('ugCgpa', editedStudent.ugCgpa);
        formData.append('ugYearOfPassing', editedStudent.ugYearOfPassing);
        formData.append('pgCollegeName', editedStudent.pgCollegeName);
        formData.append('pgSpecialization', editedStudent.pgSpecialization);
        formData.append('pgCgpa', editedStudent.pgCgpa);
        formData.append('pgYearOfPassing', editedStudent.pgYearOfPassing);
        formData.append('phdCollegeName', editedStudent.phdCollegeName);
        formData.append('phdSpecialization', editedStudent.phdSpecialization);
        formData.append('phdCgpa', editedStudent.phdCgpa);
        formData.append('phdYearOfPassing', editedStudent.phdYearOfPassing);
        formData.append('workExperience', editedStudent.workExperience);
        formData.append('course', editedStudent.course);
        formData.append('totalAmount', editedStudent.totalAmount);
        formData.append('paidAmount', editedStudent.paidAmount);
        formData.append('remainingAmount', editedStudent.remainingAmount);
        formData.append('doj', editedStudent.doj);
        formData.append('mentor', editedStudent.mentor);
        formData.append('studentImage', editedStudent.studentImage);
        formData.append('studentStatus', editedStudent.studentStatus);
        formData.append('comments', editedStudent.comments);

        try {
            await dispatch(updateStudent({ id: selectedStudent.id, data: formData }));
            console.log(formData, "From try");
            setSnackbarOpen(true);
            setErrorSnackbarOpen(false);
            setSuccessMessage(true);
            setErrorMessage("");
            setEditedStudent({
                studentId: '',
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
                paidAmount: '',
                remainingAmount: '',
                doj: "",
                mentor: "",
                studentStatus: '',
                studentImage: null,
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
        setEditedStudent(prevState => ({
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
        <div className="update-student__modal">
            <div className='student-edit-modal'>
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
                {/*<h2 style={{ paddingBottom: "2rem", color: "#0090dd" }}>Update Student Data</h2> */}
                <form onSubmit={handleUpdateSubmit} className='editedStudent'>
                    <div className="form-group">
                        <label htmlFor="studentId">Student ID:</label>
                        <input type="text" id="studentId" name="studentId" value={editedStudent.studentId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={editedStudent.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={editedStudent.lastName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fatherName">Father's Name:</label>
                        <input type="text" id="fatherName" name="fatherName" value={editedStudent.fatherName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="motherName">Mother's Name:</label>
                        <input type="text" id="motherName" name="motherName" value={editedStudent.motherName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth:</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formatDate(editedStudent.dateOfBirth)} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailId">Email ID:</label>
                        <input type="email" id="emailId" name="emailId" value={editedStudent.emailId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <textarea id="address" name="address" value={editedStudent.address} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber1">Mobile Number:</label>
                        <input type="tel" id="contactNumber1" name="contactNumber1" value={editedStudent.contactNumber1} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber2">Alternative Number:</label>
                        <input type="tel" id="contactNumber2" name="contactNumber2" value={editedStudent.contactNumber2} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <div style={{ display: "flex" }}>
                            <label><input type="radio" name="gender" value="male" checked={editedStudent.gender === 'male'} onChange={handleInputChange} /> Male</label>
                            <label><input type="radio" name="gender" value="female" checked={editedStudent.gender === 'female'} onChange={handleInputChange} /> Female</label>
                            <label><input type="radio" name="gender" value="others" checked={editedStudent.gender === 'others'} onChange={handleInputChange} /> Others</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Marital Status:</label>
                        <div style={{ display: "flex" }}>
                            <label><input type="radio" name="maritalStatus" value="Single" checked={editedStudent.maritalStatus === 'Single'} onChange={handleInputChange} />Single</label>
                            <label><input type="radio" name="maritalStatus" value="Married" checked={editedStudent.maritalStatus === 'Married'} onChange={handleInputChange} />Married</label>

                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sslc">SSLC Percentage:</label>
                        <input type="text" id="sslc" name="sslcPercentage" value={editedStudent.sslcPercentage} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="qualification">Qualification:</label>
                        <select
                            id="qualification"
                            name="qualification"
                            value={editedStudent.qualification} onChange={handleQualificationChange}
                        >
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
                                <input type="text" id="sslc" name="sslcPercentage" value={editedStudent.sslcPercentage} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isHsc && (
                            <div className="form-group">
                                <label htmlFor="hsc">HSC Percentage:</label>
                                <input type="text" id="hsc" name="hscPercentage" value={editedStudent.hscPercentage} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isDiploma && (
                            <div className="form-group">
                                <label htmlFor="diplomaPercentage">Diploma Percentage:</label>
                                <input type="text" id="diplomaPercentage" name="diplomaPercentage" value={editedStudent.diplomaPercentage} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugCollegeName">UG College Name:</label>
                                <input type="text" id="ugCollegeName" name="ugCollegeName" value={editedStudent.ugCollegeName} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugSpecialization">UG Specialization:</label>
                                <input type="text" id="ugSpecialization" name="ugSpecialization" value={editedStudent.ugSpecialization} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isUg && (

                            <div className="form-group">
                                <label htmlFor="ugCgpa">UG CGPA:</label>
                                <input type="text" id="ugCgpa" name="ugCgpa" value={editedStudent.ugCgpa} onChange={handleInputChange} />
                            </div>

                        )
                    }
                    {
                        isUg && (
                            <div className="form-group">
                                <label htmlFor="ugYearOfPassing">UG Year of Passing:</label>
                                <select id="ugYearOfPassing" name="ugYearOfPassing" value={editedStudent.ugYearOfPassing} onChange={handleInputChange} >
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
                                <input type="text" id="pgCollegeName" name="pgCollegeName" value={editedStudent.pgCollegeName} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPg && (

                            <div className="form-group">
                                <label htmlFor="pgSpecialization">PG Specialization:</label>
                                <input type="text" id="pgSpecialization" name="pgSpecialization" value={editedStudent.pgSpecialization} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgCgpa">PG CGPA:</label>
                                <input type="text" id="pgCgpa" name="pgCgpa" value={editedStudent.pgCgpa} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPg && (
                            <div className="form-group">
                                <label htmlFor="pgYearOfPassing">PG Year of Passing:</label>
                                <select id="pgYearOfPassing" name="pgYearOfPassing" value={editedStudent.pgYearOfPassing} onChange={handleInputChange} >
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
                                <input type="text" id="phdCollegeName" name="phdCollegeName" value={editedStudent.phdCollegeName} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdSpecialization">PhD Specialization:</label>
                                <input type="text" id="phdSpecialization" name="phdSpecialization" value={editedStudent.phdSpecialization} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdCgpa">PhD CGPA:</label>
                                <input type="text" id="phdCgpa" name="phdCgpa" value={editedStudent.phdCgpa} onChange={handleInputChange} />
                            </div>
                        )
                    }
                    {
                        isPhd && (
                            <div className="form-group">
                                <label htmlFor="phdYearOfPassing">PhD Year of Passing:</label>
                                <select id="phdYearOfPassing" name="phdYearOfPassing" value={editedStudent.phdYearOfPassing} onChange={handleInputChange} >
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
                        <input type="text" id="workExperience" name="workExperience" value={editedStudent.workExperience} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="course">Course: <span style={{ color: "Red" }}>*</span></label>
                        <select id="course" name="course" value={editedStudent.course} onChange={handleCourseFees}>
                            <option value="">Select Course </option>
                            {courseEntries.map(entry => (
                                <option key={entry.course} value={entry.course}>{entry.course}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Total Amount:</label>
                        <input type="number" name="totalAmount" value={editedStudent.totalAmount}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Paid Amount:</label>
                        <input type="number" name="paidAmount" value={editedStudent.paidAmount} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Remaining Amount:</label>
                        <input type="text" value={editedStudent.remainingAmount} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mentor">Mentor:</label>
                        <select id="mentor" name="mentor" value={editedStudent.mentor} onChange={handleInputChange}>
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
                        <input type="date" id="doj" name="doj" value={editedStudent.doj} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentStatus">Student Status:</label>
                        <select
                            id="studentStatus"
                            name="studentStatus"
                            value={editedStudent.studentStatus}
                            onChange={handleInputChange}
                        >
                            <option>Select Student Status</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="studentImage">Upload Photo:</label>
                        <input type="file" id="studentImage" name="studentImage" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Comments:</label>
                        <textarea id="comments" name="comments" value={editedStudent.comments}
                            onChange={handleInputChange} />
                    </div>

                    <div className="full-width" style={{ paddingBottom: "3rem" }}>
                        <div className="btn-submit">
                            <ButtonGroup
                                disableElevation
                                variant="contained"
                                aria-label="Disabled elevation buttons"
                            >
                                <Button type="Submit" style={{ fontSize: "1rem", fontWeight: "bold" }}>Save</Button>
                                <Button onClick={onClose} style={{ fontSize: "1rem", fontWeight: "bold" }}>Close</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;