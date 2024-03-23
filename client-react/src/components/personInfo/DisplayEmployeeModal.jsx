import React from 'react';
import { Modal, Typography } from '@mui/material';
import "./displayStudent.css"
import "./addStudent.css"

const DisplayEmployeeModal = ({ displayModalOpen, selectedEmployee, onClose }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }
    console.log(selectedEmployee, "selected");
    return (
        <Modal open={displayModalOpen} onClose={onClose}>
            <div className='modal-container'>
                <Typography variant="h5" className='heading' style={{ borderTopLeftRadius: "25px", borderTopRightRadius: "25px", backgroundColor: "#2196f3", color: "white", width: "100%", textAlign: "center", padding: "0.5rem 0" }}><strong>{selectedEmployee.firstName} {selectedEmployee.lastName} </strong></Typography>
                <div className='row-container'>
                    <div className="image-segment-center" >
                        <div className="student-image">
                            <div className='field-row'>
                                {/*<Typography variant="body1" style={{ color: "#2196f3", width: "100%", textAlign: "left" }}><strong>Employee Image</strong></Typography>*/}
                                <a href={selectedEmployee.employeeImage} target="_blank" rel="noopener noreferrer">
                                    <img src={selectedEmployee.employeeImage} alt="Employee" />
                                </a>
                            </div>
                            <div className='personal-details'>
                                <div className='field-row'>
                                    {/*<Typography variant="body1" style={{ color: "#2196f3", width: "100%", textAlign: "left" }}><strong>Personal Details</strong></Typography>*/}
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Employee Id</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.employeeId}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>First Name</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.firstName}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Last Name</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.lastName}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Father's Name</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.fatherName}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Mother's Name</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.motherName}</Typography>
                                </div>
                                <div className='field-row'>
                                    {/*  <Typography variant="body1" style={{ color: "#2196f3", width: "100%", textAlign: "left" }}><strong>Contact Details</strong></Typography>*/}
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Date of Birth</strong></Typography>
                                    <Typography variant="body1"> {formatDate(selectedEmployee.dateOfBirth)}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Gender</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.gender}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Marital Status</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.maritalStatus}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Email ID</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.emailId}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Address</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.address}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Contact Number</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.contactNumber1}</Typography>
                                </div>
                                {selectedEmployee.contactNumber2 && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Alternate Number</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.contactNumber2}</Typography>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/*} <div className="contact-details" style={{ borderRight: "none" }}>
                           
    </div> */}
                    </div>

                    <div className="content-container">

                        <div className='display-student-modal'>
                            <div className='education-work'>
                                <div className='field-row'>
                                    {/*<Typography variant="body1" style={{ color: "#2196f3", width: "100%", textAlign: "left" }}><strong>Education & Work</strong></Typography>
                            */}
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>SSLC Percentage</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.sslcPercentage}</Typography>
                                </div>
                                <div className='field-row'>
                                    <Typography variant="body1"><strong>Qualification</strong></Typography>
                                    <Typography variant="body1"> {selectedEmployee.qualification}</Typography>
                                </div>
                                {selectedEmployee.hscPercentage && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>HSC Percentage</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.hscPercentage}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.diplomaPercentage && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Diploma Percentage</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.diplomaPercentage}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.ugCollegeName && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG College Name</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.ugCollegeName}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.ugSpecialization && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG Specialization</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.ugSpecialization}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.ugCgpa && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG CGPA</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.ugCgpa}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.ugYearOfPassing && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>UG Year of Passing</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.ugYearOfPassing}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.pgCollegeName && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG College Name</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.pgCollegeName}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.pgSpecialization && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG Specialization</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.pgSpecialization}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.pgCgpa && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG CGPA</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.pgCgpa}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.pgYearOfPassing && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PG Year of Passing</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.pgYearOfPassing}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.phdCollegeName && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD College Name</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.phdCollegeName}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.phdSpecialization && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD Specialization</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.phdSpecialization}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.phdCgpa && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD CGPA</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.phdCgpa}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.phdYearOfPassing && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PhD Year of Passing</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.phdYearOfPassing}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.workExperience && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Work Experience</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.workExperience}</Typography>
                                    </div>
                                )}
                            </div>
                            <div className="course">
                                <div className='field-row'>
                                </div>
                                {selectedEmployee.designation && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Designation</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.designation}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.salary && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Salary</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.salary}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.annualSalary && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Annual Salary</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.annualSalary}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.doj && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Date Of Joining</strong></Typography>
                                        <Typography variant="body1"> {formatDate(selectedEmployee.doj)}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.dor && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Date Of Relieving</strong></Typography>
                                        <Typography variant="body1"> {formatDate(selectedEmployee.dor)}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.isStaff && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Teaching</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.isStaff}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.staffDoj && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Date Of Joining (As Staff)</strong></Typography>
                                        <Typography variant="body1"> {formatDate(selectedEmployee.staffDoj)}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.aadharNumber && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Aadhar Number</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.aadharNumber}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.panNumber && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>PAN Number</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.panNumber}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.bankAccountNumber && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Bank Account Number</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.bankAccountNumber}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.employeeType && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Employee Type</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.employeeType}</Typography>
                                    </div>
                                )}
                                {selectedEmployee.comments && (
                                    <div className='field-row'>
                                        <Typography variant="body1"><strong>Remarks</strong></Typography>
                                        <Typography variant="body1"> {selectedEmployee.comments}</Typography>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </Modal>
    )
}

export default DisplayEmployeeModal
