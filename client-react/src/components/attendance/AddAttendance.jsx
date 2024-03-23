/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './attendance.css';
import { showEmployees } from '../features/employeesSlice';
import { createAttendance } from '../features/attendanceSlice';

const AddAttendance = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [attendanceForm, setAttendanceForm] = useState({
        emp_name: '',
        status_work: '',
        permission: '',
        leave: '',
        in_date: '',
        in_time: '',
        out_date: '',
        out_time: '',
        comments: ''
    });
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees.employeeEntries);

    useEffect(() => {
        dispatch(showEmployees())
            .then(() => setEmployeesLoading(false))
            .catch(error => {
                console.error('Error fetching employees:', error);
                setEmployeesLoading(false);
            });
    }, [dispatch]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        if (e.target.type === 'radio') {
            setAttendanceForm(prevState => ({
                ...prevState,
                [name]: value === 'Yes' ? 'Yes' : 'No',
            }));
        } else {
            setAttendanceForm(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createAttendance(attendanceForm));
            setSnackbarOpen(true);
            setErrorSnackbarOpen(false);
            setSuccessMessage(true);
            setErrorMessage("");
            setAttendanceForm({
                emp_name: '',
                status_work: '',
                permission: '',
                leave: '',
                in_date: '',
                in_time: '',
                out_date: '',
                out_time: '',
                comments: '',
            });
        } catch (error) {
            console.log("Error:", error);
            setErrorSnackbarOpen(true);
            setSnackbarOpen(false);
            setSuccessMessage(false);
            setErrorMessage("Error occurred!!!");
        }
    };

    return (
        <div className='attendance-container'>
            <div className='bread-crumb'>
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/display-attendance`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Attendance List
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Register Employee Attendance</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            {successMessage && (
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
                        Successfully created!
                    </MuiAlert>
                </Snackbar>
            )}
            {errorMessage && (
                <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
                        Error Occured !!!
                    </MuiAlert>
                </Snackbar>
            )}
            <div className='add-emp_atten_container'>
                <form onSubmit={handleAttendanceSubmit} className='attendance-form'>
                    <div className="form-group">
                        <label>Select Employee:</label>
                        <select value={attendanceForm.emp_name} onChange={handleInputChange} name='emp_name'>
                            <option value="">Select an employee</option>

                            {employees.map(employee => (
                                <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                                    {`${employee.firstName} ${employee.lastName}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status Work:</label>
                        <select value={attendanceForm.status_work} onChange={handleInputChange} name='status_work'>
                            <option value=''>Select Status</option>
                            <option value='Work from Home'>Work from Home</option>
                            <option value='In Office'>In Office</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Permission:</label>
                        <div className="radio-row">
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="permissionYes"
                                    name="permission"
                                    value="Yes"
                                    checked={attendanceForm.permission === 'Yes'}
                                    onChange={(e) => setAttendanceForm({ ...attendanceForm, permission: e.target.value })}
                                />
                                <label htmlFor="permissionYes">Yes</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="permissionNo"
                                    name="permission"
                                    value="No"
                                    checked={attendanceForm.permission === 'No'}
                                    onChange={(e) => setAttendanceForm({ ...attendanceForm, permission: e.target.value })}
                                />
                                <label htmlFor="permissionNo">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Leave:</label>
                        <div className="radio-row">
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="leaveYes"
                                    name="leave"
                                    value="Yes"
                                    checked={attendanceForm.leave === 'Yes'}
                                    onChange={(e) => setAttendanceForm({ ...attendanceForm, leave: e.target.value })}
                                />
                                <label htmlFor="leaveYes">Yes</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <input
                                    type="radio"
                                    id="leaveNo"
                                    name="leave"
                                    value="No"
                                    checked={attendanceForm.leave === 'No'}
                                    onChange={(e) => setAttendanceForm({ ...attendanceForm, leave: e.target.value })}
                                />
                                <label htmlFor="leaveNo">No</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>In Date:</label>
                        <input type='date' value={attendanceForm.in_date} onChange={handleInputChange} name='in_date' />
                    </div>
                    <div className="form-group">
                        <label>In Time:</label>
                        <input type='time' value={attendanceForm.in_time} onChange={handleInputChange} name='in_time' />
                    </div>
                    <div className="form-group">
                        <label>Out Date:</label>
                        <input type='date' value={attendanceForm.out_date} onChange={handleInputChange} name='out_date' />
                    </div>
                    <div className="form-group">
                        <label>Out Time:</label>
                        <input type='time' value={attendanceForm.out_time} onChange={handleInputChange} name='out_time' />
                    </div>
                    <div className="form-group">
                        <label>Comments:</label>
                        <textarea value={attendanceForm.comments} onChange={handleInputChange} name='comments' />
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

export default AddAttendance;
