import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStaffDetail } from '../features/staffSlice';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import Select from 'react-select';
import { showEmployees, updateEmployee } from "../features/employeesSlice";
import { Link } from 'react-router-dom';


const AddStaff = () => {
    const [createStaff, setCreateStaff] = useState({
        staffName: "",
        staffDoj: "",
        comments: "",
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
            }
        }

        dispatch(createStaffDetail(updatedStaff));
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
    const employeeOptions = employeeList.map(employee => ({
        value: employee.id,
        label: `${employee.firstName} ${employee.lastName}`
    }));

    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/vendors" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Vendors
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Register Staff</h2>
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
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="staffDoj">Date of Joining:</label>
                        <input
                            type="date"
                            id="staffDoj"
                            name="staffDoj"
                            value={createStaff.staffDoj}
                            onChange={e => setCreateStaff({ ...createStaff, staffDoj: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Comments:</label>
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
