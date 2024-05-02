/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import logo from "./assets/kitkat-removebg-preview.png"
import { useNavigate } from 'react-router-dom';
import SidebarItems from './SidebarItems';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../client-react/src/components/features/loginUserSlice';
import { selectUser } from "../../../client-react/src/components/features/loginUserSlice";
import './sidebar.css';
import { updateStaffDetail, getStaffDetails } from '../components/features/staffSlice';
import axios from 'axios';

const CustomScrollbar = styled('div')({
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 5px grey',
        borderRadius: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#bdbdbd',
        borderRadius: '5px',
        height: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#a8a7a7',
    },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid currentColor',
            content: '""',
        },
    },
}));

// Function to get color code based on the letter
function getColorCode(letter) {
    switch (letter.toUpperCase()) {
        case 'A':
            return '#7A6FBE'; // Purple
        case 'B':
            return '#5496E3'; // Blue
        case 'C':
            return '#5CB7B1'; // Teal
        case 'D':
            return '#7E685A'; // Brown
        case 'E':
            return '#FFB83C'; // Yellow
        case 'F':
            return '#F0776C'; // Pink
        case 'G':
            return '#70CC72'; // Green
        case 'H':
            return '#926AA6'; // Lavender
        case 'I':
            return '#89B9E8'; // Light Blue
        case 'J':
            return '#78B7BB'; // Aqua
        case 'K':
            return '#DE9E36'; // Orange
        case 'L':
            return '#ACD374'; // Lime
        case 'M':
            return '#C8A2C8'; // Light Purple
        case 'N':
            return '#87D5F3'; // Sky Blue
        case 'O':
            return '#E8A869'; // Light Orange
        case 'P':
            return '#F4BB7D'; // Peach
        case 'Q':
            return '#B5D8EB'; // Light Sky Blue
        case 'R':
            return '#9BBB59'; // Olive
        case 'S':
            return '#8CC7A6'; // Light Green
        case 'T':
            return '#D7B9D5'; // Light Lavender
        case 'U':
            return '#8FB2D3'; // Lighter Blue
        case 'V':
            return '#D09E9E'; // Light Red
        case 'W':
            return '#C3D69B'; // Pale Green
        case 'X':
            return '#DFDAC1'; // Beige
        case 'Y':
            return '#F0DDAA'; // Cream
        case 'Z':
            return '#EAD98B'; // Light Yellow
        default:
            return '#cccccb'; // grey (default color)
    }
}

const Sidebar = ({ width, collapsed, items }) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editableUsername, setEditableUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.userName || '');
    const staff = useSelector(state => state.staffDetails.staffDetailEntries);
    const inputRef = useRef(null);
    const [usersAdmin, setUsersAdmin] = useState(null);

    const [selectedStaff, setSelectedStaff] = useState("");
    // console.log("User--", user);
    useEffect(() => {
        fetchData();
    }, [user]);
    // console.log("user", user);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8011/hrm/user');
            const filteredData = response.data.filter(data => {
                return user.userName === data.userName;
            });
            setUsersAdmin(filteredData);

        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        setNewUsername(user?.userName || '');
    }, [user]);
    useEffect(() => {
        dispatch(getStaffDetails());
    }, [dispatch]);
    useEffect(() => {
        if (user && staff.length > 0) {
            const matchedStaff = staff.find(member => member.userName === user.userName);
            if (matchedStaff) {
                setSelectedStaff(matchedStaff);
            } else {
                setSelectedStaff({});
            }
        } else {
            setSelectedStaff({});
        }
    }, [user, staff]);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const sidebarStyle = {
        width: collapsed ? '60px' : `${width}px`,
        transition: 'width 0.3s ease',
    };

    const getUserUpperCaseName = () => {
        return editableUsername ? newUsername.toUpperCase() : (user && user.userName ? user.userName.toUpperCase() : '');
    };

    const getAvatarBackgroundColor = () => {
        const firstLetter = editableUsername ? newUsername.charAt(0) : (user && user.userName ? user.userName.charAt(0) : '');
        return getColorCode(firstLetter);
    };

    const navigateHome = () => {
        navigate("/home");
    };

    const handleEditUsername = () => {
        setEditableUsername(true);
        setNewUsername(user?.userName || '');
    };

    const handleUsernameChange = (event) => {
        setNewUsername(event.target.value);
    };
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setEditableUsername(false);
        }
    };
    const handleSaveUsername = async () => {
        try {
            const updateStaff = {
                staffName: selectedStaff.staffName,
                staffDoj: selectedStaff.staffDoj,
                userName: newUsername,
                password: selectedStaff.password
            };
            const updatedAdmin = {
                userName: newUsername,
                password: selectedStaff.password
            }
            console.log(selectedStaff, usersAdmin);
            // Check if selectedStaff._id is undefined, null, or empty
            if (!selectedStaff || !selectedStaff._id) {
                if (usersAdmin.length > 0) {
                    await axios.put(`http://localhost:8011/hrm/updateUser/${usersAdmin[0]._id}`, updatedAdmin);
                } else {
                    console.error('Error: usersAdmin is empty.');
                }
            } else {
                if (usersAdmin.length > 0) {
                    const isAdmin = usersAdmin.some(admin => admin.userName === selectedStaff.userName);

                    if (isAdmin) {
                        await Promise.all([
                            dispatch(updateStaffDetail({ id: selectedStaff._id, updatedData: updateStaff })),
                            axios.put(`http://localhost:8011/hrm/updateUser/${usersAdmin[0]._id}`, updatedAdmin)
                        ]);
                    } else {
                        console.error('Error: selectedStaffDetails.userName is not present in usersAdmin.userName.');
                    }
                } else {
                    console.error('Error: usersAdmin is empty.');
                }
            }

            setUser({ ...user, userName: newUsername });
            setNewUsername(newUsername);
            localStorage.setItem("user", JSON.stringify({ ...user, userName: newUsername }));
            window.location.reload();

        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <CustomScrollbar className="sidebar" style={sidebarStyle}>
            {sidebarStyle.width === '60px' ?
                <div className="min-side-header">
                    <Avatar sx={{ bgcolor: getAvatarBackgroundColor() }}>{getUserUpperCaseName().charAt(0)}</Avatar>
                </div>
                :
                <div className='sidebar-header'>
                    <div className="logo" onClick={navigateHome} style={{ cursor: "pointer" }}>
                        <img src={logo} alt="Kitkat Tech" />
                    </div>

                    <div className="profile-card">
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                        >
                            <Avatar alt={getUserUpperCaseName()} src="/static/images/avatar/1.jpg" sx={{ bgcolor: getAvatarBackgroundColor() }} />
                        </StyledBadge>
                        {editableUsername ? (
                            <div style={{ marginLeft: "10px" }}>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={handleUsernameChange}
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSaveUsername();
                                        }
                                    }}
                                    ref={inputRef}
                                />
                            </div>
                        ) : (
                            <div>
                                <h4 className='profile-name' onClick={handleEditUsername}>
                                    {getUserUpperCaseName()}
                                </h4>
                            </div>
                        )}
                    </div>
                </div>
            }
            {
                items.map((item) => <SidebarItems key={item.id} item={item} sidebarWidth={sidebarStyle.width} />)
            }
        </CustomScrollbar>
    )
};

export default Sidebar;