import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { getStaffDetails } from "../features/staffSlice";
import { fetchCourse } from '../features/courseSlice';
import axios from "axios";
const sourceOptions = [
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Ads', label: 'Ads' }
];
const followUpdatesOptions = [
    { value: 'Interested', label: 'Interested' },
    { value: 'Not Interested', label: 'Not Interested' },
    { value: 'Call Back', label: 'Call Back' },
    { value: 'No Response', label: 'No Response' },
    { value: 'Call Done', label: 'Call Done' }
];
const detailSentOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
];
const AddManualLead = () => {

    const dispatch = useDispatch();
    const [staffList, setStaffList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    useEffect(() => {
        dispatch(getStaffDetails())
            .then(response => {
                setStaffList(response.payload.map(staff => ({ value: staff.staffName, label: staff.staffName })));
            })
            .catch(error => {
                console.error('Error fetching staff details:', error);
            });
        dispatch(fetchCourse())
            .then(response => {
                setCourseList(response.payload.map(course => ({ value: course.course, label: course.course })))
            })
            .catch(error => {
                console.error('Error fetching course data:', error);
            });
    }, [dispatch]);
    const [leads, setLeads] = useState({
        DateCol: "",
        Name: "",
        Qualification: "",
        YearOfPassing: "",
        PhoneNumber: "",
        FollowUpdates: [],
        FollowupPerson: "",
        Location: "",
        Course: "",
        Source: "",
        Rescheduled: "",
        DetailsSent: "",
    })
    const handleInputChangeLeads = (e) => {
        const { name, value } = e.target;
        const updatedLeads = { ...leads, [name]: value };

        setLeads(updatedLeads);
    }

    const handleLeadsSubmit = async (e) => {
        e.preventDefault();
        console.log(leads, "before submit");
        const updateDetails = {
            ...leads,
            FollowUpdates: leads.FollowUpdates.map(option => option.value)
        }
        console.log(updateDetails, "before submit");

        try {
            const response = await axios.post("http://localhost:8011/excelData/insert_excelFiles", updateDetails);
            if (response.data.success) {
                console.log("Data inserted successfully");
                setLeads(prevLeads => ({
                    ...prevLeads,
                    DateCol: "",
                    Name: "",
                    Qualification: "",
                    YearOfPassing: "",
                    PhoneNumber: "",
                    FollowUpdates: [],
                    FollowupPerson: "",
                    Location: "",
                    Course: "",
                    Source: "",
                    Rescheduled: "",
                    DetailsSent: "",
                }));
            } else {
                console.error("Failed to insert data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return (
        <div className='student-view-container'>
            <div className="bread-crumb">
                <div className="content-wrapper">
                    {/* Create Button */}
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to="/home/excel-leads" className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Leads
                        </Link>
                    </div>
                    {/* Title */}
                    <h2 style={{ color: "#0090dd" }}>Register Leads</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="add-student_container">
                <form onSubmit={handleLeadsSubmit} className='studentForm'>
                    <div className="form-group">
                        <label htmlFor="DateCol">Date:</label>
                        <input
                            type="date"
                            id="DateCol"
                            name="DateCol"
                            value={leads.DateCol}
                            onChange={handleInputChangeLeads}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Name">Name:</label>
                        <input
                            type="text"
                            id="Name"
                            name="Name"
                            value={leads.Name}
                            onChange={handleInputChangeLeads}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Qualification">Qualification:</label>
                        <input
                            type="text"
                            id="Qualification"
                            name="Qualification"
                            value={leads.Qualification}
                            onChange={handleInputChangeLeads}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="YearOfPassing">Year Of Passing:</label>
                        <input
                            type="text"
                            id="YearOfPassing"
                            name="YearOfPassing"
                            value={leads.YearOfPassing}
                            onChange={handleInputChangeLeads}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="PhoneNumber">Phone Number:</label>
                        <input
                            type="text"
                            id="PhoneNumber"
                            name="PhoneNumber"
                            value={leads.PhoneNumber}
                            onChange={handleInputChangeLeads}
                            required
                            maxLength={10} minLength={10}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Location">Location:</label>
                        <input
                            type="text"
                            id="Location"
                            name="Location"
                            value={leads.Location}
                            onChange={handleInputChangeLeads}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="FollowUpdates">Follow Updates:</label>
                        <Select
                            id="FollowUpdates"
                            name="FollowUpdates"
                            options={followUpdatesOptions}
                            value={leads.FollowUpdates}
                            onChange={(selectedOption) => setLeads({ ...leads, FollowUpdates: selectedOption || [] })}
                            placeholder="Select Recent Follow Update"
                            isSearchable={true}
                            isMulti
                            styles={{
                                container: provided => ({
                                    ...provided,
                                    width: "100%"
                                }),
                                valueContainer: provided => ({ ...provided, textAlign: "left" }),
                                menu: provided => ({ ...provided, textAlign: "left" }),
                                option: provided => ({ ...provided, textAlign: "left" })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="DetailsSent">Details Sent:</label>
                        <Select
                            id="DetailsSent"
                            name="DetailsSent"
                            options={detailSentOptions}
                            value={detailSentOptions.find(option => option.value === leads.DetailsSent)}
                            onChange={(selectedOption) => setLeads({ ...leads, DetailsSent: selectedOption.value })}
                            required
                            placeholder="Select Details Sent Options"
                            isSearchable={true}
                            styles={{
                                container: provided => ({
                                    ...provided,
                                    width: "100%"
                                }),
                                valueContainer: provided => ({ ...provided, textAlign: "left" }),
                                menu: provided => ({ ...provided, textAlign: "left" }),
                                option: provided => ({ ...provided, textAlign: "left" })
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="FollowupPerson">Assigned To:</label>
                        <Select
                            id="FollowupPerson"
                            name="FollowupPerson"
                            options={staffList}
                            value={staffList.find(option => option.value === leads.FollowupPerson)}
                            onChange={(selectedOption) => setLeads({ ...leads, FollowupPerson: selectedOption.value })}
                            placeholder="Choose a Staff Member"
                            isSearchable={true}
                            styles={{
                                container: provided => ({
                                    ...provided,
                                    width: "100%"
                                }),
                                valueContainer: provided => ({ ...provided, textAlign: "left" }),
                                menu: provided => ({ ...provided, textAlign: "left" }),
                                option: provided => ({ ...provided, textAlign: "left" })
                            }}
                        />
                    </div>
                    {leads.FollowUpdates.some(option => option.value === 'Call Back.') && (
                        <div className="form-group">
                            <label htmlFor="Rescheduled">Rescheduled:</label>
                            <input
                                type="date"
                                id="Rescheduled"
                                name="Rescheduled"
                                value={leads.Rescheduled}
                                onChange={handleInputChangeLeads}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="Course">Course:</label>
                        <Select
                            type="text"
                            id="Course"
                            name="Course"
                            options={courseList}
                            value={courseList.find(option => option.value === leads.Course)}
                            onChange={(selectedOption) => setLeads({ ...leads, Course: selectedOption.value })}
                            isSearchable={true}
                            placeholder="Select the Course"
                            styles={{
                                container: provided => ({
                                    ...provided,
                                    width: "100%"
                                }),
                                valueContainer: provided => ({ ...provided, textAlign: "left" }),
                                menu: provided => ({ ...provided, textAlign: "left" }),
                                option: provided => ({ ...provided, textAlign: "left" })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Source">Source:</label>
                        <Select
                            id="Source"
                            name="Source"
                            options={sourceOptions}
                            value={sourceOptions.find(option => option.value === leads.Source)}
                            onChange={(selectedOption) => setLeads({ ...leads, Source: selectedOption.value })}
                            isSearchable={true}
                            placeholder="Select the Source"
                            styles={{
                                container: provided => ({
                                    ...provided,
                                    width: "100%"
                                }),
                                valueContainer: provided => ({ ...provided, textAlign: "left" }),
                                menu: provided => ({ ...provided, textAlign: "left" }),
                                option: provided => ({ ...provided, textAlign: "left" })
                            }}
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

export default AddManualLead
