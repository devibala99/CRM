/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaffDetail } from '../features/staffSlice';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import Select from 'react-select';
import { showEmployees, updateEmployee } from "../features/employeesSlice";
import { Link } from 'react-router-dom';
import { createUser } from "../features/registerDetailSlice";


const AddStaff = () => {
    const [createStaff, setCreateStaff] = useState({
        staffName: "",
        staffDoj: "",
        comments: "",
        userName: "",
        password: "",
    });
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const employeeList = useSelector(state => state.employees.employeeEntries);

    useEffect(() => {
        dispatch(showEmployees());
    }, [dispatch]);

    const handleInputChange = (selectedOption) => {
        setName(selectedOption.label);
    };
    const handleStaffSubmit = (e) => {
        e.preventDefault();
        const updatedStaff = { ...createStaff, staffName: name };
        console.log(updatedStaff, "Frontend", name);
        if (name) {
            const staffDoj = createStaff.staffDoj;
            const selectedEmployee = employeeList.find(employee => `${employee.firstName} ${employee.lastName}` === name);
            if (selectedEmployee) {
                const updatedEmployee = {
                    ...selectedEmployee,
                    isStaff: "Yes",
                    staffDoj: staffDoj
                };
                dispatch(updateEmployee({ id: updatedEmployee.id, data: updatedEmployee }));
                dispatch(createUser({ userName: createStaff.userName, password: createStaff.password }));
            }
        }
        dispatch(createStaffDetail(updatedStaff));
        setCreateStaff({
            staffName: "",
            staffDoj: "",
            userName: "",
            password: "",
            comments: "",
        })
    };

    const handleCreateOption = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        // console.log("New--", newOption)
        setCreateStaff(prevState => ({
            ...prevState,
            staffName: newOption
        }));
        return newOption;
    };
    const employeeOptions = Array.isArray(employeeList) ? employeeList
        .filter(employee => employee.isStaff === "Yes")
        .map(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`;
            return {
                value: employee.id,
                label: fullName
            };
        }) : [];


    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/new-employee/:employeeId" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Add Employee
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Register Admin</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="add-employee_container">
                <form onSubmit={handleStaffSubmit} className='employeeForm'>
                    <div className="form-group" style={{ width: "100%" }}>
                        <label htmlFor="staffName" style={{ paddingBottom: ".4rem" }}>Staff Name:</label>
                        <Select
                            id="staffName"
                            name="staffName"
                            value={employeeOptions.find(option => option.label === name)}
                            onChange={handleInputChange}
                            options={employeeOptions}
                            isSearchable={true}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: "100%",
                                }),
                                valueContainer: (provided) => ({ ...provided, textAlign: "left" }),
                                menu: (provided) => ({ ...provided, textAlign: "left" }),
                                option: (provided) => ({ ...provided, textAlign: "left" })
                            }}
                            onCreateOption={handleCreateOption}
                        // isRequired
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="staffDoj">Date of Joining:</label>
                        <input
                            type="date"
                            id="staffDoj"
                            name="staffDoj"
                            value={createStaff.staffDoj}
                            // required
                            onChange={e => setCreateStaff({ ...createStaff, staffDoj: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userName">User Name:</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            autoComplete="username"
                            value={createStaff.userName}
                            required
                            onChange={e => setCreateStaff({ ...createStaff, userName: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            style={{ padding: ".5rem" }}
                            value={createStaff.password}
                            autoComplete="current-password"
                            required
                            onChange={e => setCreateStaff({ ...createStaff, password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comments">Comments:</label>
                        <textarea
                            type="text"
                            id="comments"
                            name="comments"
                            value={createStaff.comments}
                            onChange={e => setCreateStaff({ ...createStaff, comments: e.target.value })}
                        />
                    </div>
                    <div className="full-width">
                        <div className="btn-submit">
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStaff;
