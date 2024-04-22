/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserDetails } from "../../../client-react/src/components/features/registerDetailSlice";
import { selectUser } from "../../../client-react/src/components/features/loginUserSlice";
import Button from '@mui/material/Button';
import { Modal, Paper } from '@mui/material';
import { getStaffDetails, updateStaffDetail } from "../../../client-react/src/components/features/staffSlice";
import axios from 'axios';

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [open, setOpen] = useState(true);
    const [name, setName] = useState(user ? user.userName : '');
    const [password, setPassword] = useState(user ? user.password : '');
    const [usersStaff, setUsersStaff] = useState(null);
    const [usersAdmin, setUsersAdmin] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(getStaffDetails());
                console.log("Response from getStaffDetails:", response);

                if (Array.isArray(response.payload) && response.payload.length > 0) {
                    const filteredData = response.payload.filter(data => data.userName === user.userName);
                    setUsersStaff(filteredData);

                    if (filteredData.length > 0) {
                        // Fetch user details and filter based on usersStaff
                        const userResponse = await axios.get('http://localhost:8011/hrm/user');
                        const filteredUserAdmin = userResponse.data.filter(userData => {
                            return filteredData.some(staff => staff.userName === userData.userName);
                        });
                        setUsersAdmin(filteredUserAdmin);
                    }
                } else {
                    console.error("Invalid response format:", response);
                }
            } catch (error) {
                console.error("Error fetching staff details:", error);
            }
        };

        fetchData();

    }, [dispatch, user]);


    console.log(usersStaff, "userstaff");
    const handleClose = () => {
        setOpen(false);
    };
    const handleSave = async () => {
        console.log("Users Staff:", usersStaff);
        console.log(usersAdmin, "userRegister");
        console.log("User ID:", user ? user._id : null);

        // Check if usersStaff is empty
        if (!usersStaff || usersStaff.length === 0) {
            console.error("Users Staff is empty.");
            return;
        }

        try {
            const updatedData = {
                userName: name,
                password: password,
                staffName: usersStaff[0].staffName,
                staffDoj: usersStaff[0].staffDoj
            };
            const updatedAdmin = {
                userName: name,
                password: password
            };
            console.log(updatedAdmin, "Admin");
            await Promise.all([
                user && dispatch(updateUserDetails({ userId: user._id, updatedData: updatedAdmin })),
                dispatch(updateStaffDetail({ id: usersStaff[0]._id, updatedData })),
            ]);

            localStorage.setItem("user", JSON.stringify({ ...user, userName: name, password: password }));
            handleClose();
        } catch (error) {
            console.error("Error updating staff:", error);
        }
    };



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Paper
                sx={{
                    position: 'absolute',
                    width: 500,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Update Profile</h1>
                    </div>
                    <div>
                        <h2 className='cancel-model-btn' onClick={handleClose}>X</h2>
                    </div>
                </div>
                <div style={{ border: "1px solid rgba(159, 159, 159, 0.497)", borderRadius: "4px", padding: "0 1rem", margin: "0" }}>

                    <br />
                    <div className="student-form" style={{ padding: "0", margin: "0" }}>
                        <div className="form-group">
                            <label htmlFor="name">User Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="User Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" style={{ padding: ".5rem" }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "1rem" }}>
                            <Button onClick={handleSave} style={{
                                fontWeight: "500", color: "white", borderRadius: "20px", padding: "10px", width: "90px",
                                backgroundColor: "#0090dd", letterSpacing: "1px"
                            }}>Save</Button>
                        </div>
                    </div>
                </div>
            </Paper>
        </Modal>
    );
};

export default Profile;
// <div className="form-group">
// <label htmlFor="email">User Email</label>
// <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
// </div>
// <Button component={Link} to="/hrm/reset-password/:id/:token">Change Password</Button>