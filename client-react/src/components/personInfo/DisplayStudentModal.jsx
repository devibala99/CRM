/* eslint-disable no-unused-vars */
// /* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Modal, Typography, Button } from '@mui/material';
import "./displayStudent.css"
import "./addStudent.css"


const DisplayStudentModal = ({ displayModalOpen, selectedStudent, onClose }) => {

    const handleCloseClick = () => {
        console.log("Close")
        setTimeout(() => {
            onClose();
        }, 1000);
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    return (
        <Modal open={displayModalOpen} onClose={onClose}>
            <div className='modal-container'>
                <Typography variant="h5" className='heading' style={{ borderTopLeftRadius: "25px", borderTopRightRadius: "25px", backgroundColor: "#2196f3", color: "white", width: "100%", textAlign: "center", padding: "0.5rem 0" }}><strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong></Typography>
                <div className='row-container'>
                    <div className="top-container">
                        <div className="image-segment-center">
                            <div className="student-image" style={{ width: "100%" }}>
                                <div className='field-row'>
                                    {/*<Typography variant="body1" style={{ color: "#2196f3", paddingBottom: "0rem", width: "100%", textAlign: "left" }}><strong>Student Image</strong></Typography> */}
                                    <a href={selectedStudent.studentImage} target="_blank" rel="noopener noreferrer">
                                        <img src={selectedStudent.studentImage} alt="Student" style={{ width: "250px", height: "190px" }} />
                                    </a>
                                </div>

                                <div className='personal-details'>
                                    <div className='field-row'>
                                        {/* <Typography variant="body1" style={{ color: "#2196f3", paddingBottom: "1rem", width: "100%", textAlign: "left" }}><strong>Personal Details</strong></Typography>* */}
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Student Id</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.studentId}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>First Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.firstName}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Last Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.lastName}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Father's Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.fatherName}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Mother's Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.motherName}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        {/*   <Typography variant="body1" style={{ color: "#2196f3", paddingBottom: "1rem", width: "100%", textAlign: "left" }}><strong>Contact Details</strong></Typography>* */}
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Date of Birth</strong></Typography>
                                        <Typography variant="body1"> {formatDate(selectedStudent.dateOfBirth)}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Gender</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.gender}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Marital Status</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.maritalStatus}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Email ID</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.emailId}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Address</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.address}</Typography>
                                    </div>
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Mobile No</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.contactNumber1}</Typography>
                                    </div>
                                    {selectedStudent.contactNumber2 && (
                                        <div className='field-row'>
                                            <Typography variant="body1"><strong>Alternate No</strong></Typography>
                                            <Typography variant="body1"> {selectedStudent.contactNumber2}</Typography>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-container">
                        <div className='display-student-modal'>
                            <div className='education-work'>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>SSLC Percentage</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.sslcPercentage}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Qualification</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.qualification}</Typography>
                                </div>
                                {selectedStudent.hscPercentage && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>HSC Percentage</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.hscPercentage}</Typography>
                                    </div>
                                )}
                                {selectedStudent.diplomaPercentage && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Diploma Percentage</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.diplomaPercentage}</Typography>
                                    </div>
                                )}
                                {selectedStudent.ugCollegeName && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG College Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.ugCollegeName}</Typography>
                                    </div>
                                )}
                                {selectedStudent.ugSpecialization && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG Specialization</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.ugSpecialization}</Typography>
                                    </div>
                                )}
                                {selectedStudent.ugCgpa && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG CGPA</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.ugCgpa}</Typography>
                                    </div>
                                )}
                                {selectedStudent.ugYearOfPassing && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG Year of Passing</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.ugYearOfPassing}</Typography>
                                    </div>
                                )}
                                {selectedStudent.pgCollegeName && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG College Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.pgCollegeName}</Typography>
                                    </div>
                                )}
                                {selectedStudent.pgSpecialization && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG Specialization</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.pgSpecialization}</Typography>
                                    </div>
                                )}
                                {selectedStudent.pgCgpa && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG CGPA</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.pgCgpa}</Typography>
                                    </div>
                                )}
                                {selectedStudent.pgYearOfPassing && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG Year of Passing</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.pgYearOfPassing}</Typography>
                                    </div>
                                )}
                                {selectedStudent.phdCollegeName && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD College Name</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.phdCollegeName}</Typography>
                                    </div>
                                )}
                                {selectedStudent.phdSpecialization && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD Specialization</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.phdSpecialization}</Typography>
                                    </div>
                                )}
                                {selectedStudent.phdCgpa && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD CGPA</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.phdCgpa}</Typography>
                                    </div>
                                )}
                                {selectedStudent.phdYearOfPassing && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD Year of Passing</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.phdYearOfPassing}</Typography>
                                    </div>
                                )}
                                {selectedStudent.workExperience && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Work Experience</strong></Typography>
                                        <Typography variant="body1"> {selectedStudent.workExperience}</Typography>
                                    </div>
                                )}
                            </div>
                            <div className="course">
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Course</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.course}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Total Amount</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.totalAmount}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Paid Amount</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.paidAmount}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Remaining Amount</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.remainingAmount}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Student Status</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.studentStatus}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Remarks</strong></Typography>
                                    <Typography variant="body1"> {selectedStudent.comments}</Typography>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default DisplayStudentModal;
