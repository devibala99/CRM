import React, { useState } from 'react'
import SidebarBreadcrumbs from '../../navigationbar/SidebarBreadcrumbs';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const CreateCourse = () => {

    const [createCourse, setCreateCourse] = useState({
        course: "",
        courseFees: "",
        duration: "",
    })
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreateCourse({ ...createCourse, [name]: value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <div className="student-container">
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/newCourse`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <PersonAddIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Course
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}>Plan Course Offering</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>
            <div className="master-field">
                <div onSubmit={handleSubmit} className="form-group-master">
                    <div className="first-input">
                        <label htmlFor="course">Course:</label>
                        <input
                            type="text"
                            id="course"
                            name="course"
                            value={createCourse.course}
                            onChange={e => handleInputChange(e.target.value)}

                        />
                    </div>
                    <div className="second-input">
                        <label htmlFor={`courseFees`}>Fees:</label>
                        <input
                            type="text"
                            id={`courseFees`}
                            name="courseFees"
                            value={createCourse.courseFees}
                            onChange={e => handleInputChange(e.target.value)}

                        />
                    </div>
                    <div className="third-input">
                        <label htmlFor={`duration`}>Duration:</label>
                        <input
                            type="text"
                            id={`duration`}
                            name="duration"
                            value={createCourse.duration}
                            onChange={e => handleInputChange(e.target.value)}

                        />
                    </div>

                </div>
                <div className="full-width" style={{ paddingBottom: "3rem" }}>
                    <div className="btn-submit">
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateCourse
