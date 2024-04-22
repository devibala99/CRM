/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { createInterview } from '../features/interviewSlice';
import { Link } from 'react-router-dom';
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import Select from 'react-select';

const followUpDatesOptions = [
    { value: 'Interviewed', label: 'Interviewed' },
    { value: 'Not Interviewed', label: 'Not Interviewed' },
    { value: 'Call Back', label: 'Call Back' },
    { value: 'No Response', label: 'No Response' },
    { value: 'Call Done', label: 'Call Done' }
];

const AddInterview = () => {

    const dispatch = useDispatch();
    const [person, setPerson] = useState({
        investicatedDate: "",
        intervieweeName: "",
        email: "",
        phoneNumber: "",
        qualification: "",
        yearOfPassing: "",
        location: "",
        followUpDates: [],
        scheduledDate: "",
        jobRole: "",
        source: "",
        candidateImage: null
    });
    function formattedDate(dateValue) {
        if (!dateValue) return '';
        const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        if (isNaN(dateObj.getTime())) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'candidateImage') {
            const file = files[0];
            setPerson(prevState => ({
                ...prevState,
                [name]: file
            }));
        } else {
            const updatedPerson = { ...person, [name]: value };
            setPerson(updatedPerson);
        }
    };

    const handleFollowUpDatesChange = (selectedOptions) => {
        const followUpDates = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setPerson(prevState => ({
            ...prevState,
            followUpDates: followUpDates
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedPerson = {
            ...person,
            investicatedDate: formattedDate(person.investicatedDate),
            scheduledDate: formattedDate(person.scheduledDate)
        };

        const formData = new FormData();
        Object.entries(formattedPerson).forEach(([key, value]) => {
            if (key === 'candidateImage' && value) {
                formData.append(key, value, value.name);
            } else {
                formData.append(key, value);
            }
        });

        try {
            await dispatch(createInterview(formData));
            setPerson({
                investicatedDate: "",
                intervieweeName: "",
                email: "",
                phoneNumber: "",
                qualification: "",
                yearOfPassing: "",
                location: "",
                followUpDates: [],
                scheduledDate: "",
                jobRole: "",
                source: "",
                candidateImage: null,
            });
        } catch (error) {
            console.error("Error submitting interview:", error);
            return error.message;
        }
    }

    return (
        <div className="student-container">
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/view-interview`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Interviews List
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Register Student</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="add-student_container">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className='studentForm'>
                    <div className="form-group">
                        <label htmlFor="investicatedDate">Investicated Date:</label>
                        <input
                            type="date"
                            id="investicatedDate"
                            name="investicatedDate"
                            value={person.investicatedDate}
                            onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="intervieweeName">Interviewee Name:</label>
                        <input
                            type="text"
                            id="intervieweeName"
                            name="intervieweeName"
                            value={person.intervieweeName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={person.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={person.phoneNumber}
                            onChange={handleChange}
                            required
                            maxLength={10} minLength={10}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="qualification">Qualification:</label>
                        <input
                            type="text"
                            id="qualification"
                            name="qualification"
                            value={person.qualification}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="yearOfPassing">Year of Passing:</label>
                        <input
                            type="text"
                            id="yearOfPassing"
                            name="yearOfPassing"
                            value={person.yearOfPassing}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={person.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="followUpDates">Follow Up Dates:</label>
                        <Select
                            id="followUpDates"
                            name="followUpDates"
                            options={followUpDatesOptions}
                            value={person.followUpDates.map(date => ({ value: date, label: date }))}
                            onChange={handleFollowUpDatesChange}
                            placeholder="Select Follow Up Dates"
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
                        <label htmlFor="scheduledDate">Scheduled Date:</label>
                        <input
                            type="date"
                            id="scheduledDate"
                            name="scheduledDate"
                            value={person.scheduledDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="jobRole">Job Role:</label>
                        <input
                            type="text"
                            id="jobRole"
                            name="jobRole"
                            value={person.jobRole}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="source">Source:</label>
                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={person.source}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="candidateImage">Upload Image:</label>
                        <input
                            type="file"
                            id="candidateImage"
                            name="candidateImage"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleChange}
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

export default AddInterview
