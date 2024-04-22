// /* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Profile from './Profile';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../../client-react/src/components/features/loginUserSlice";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { selectUser } from "../../../client-react/src/components/features/loginUserSlice";
import { useNavigate } from "react-router-dom";


import "./header.css"

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(5)})`,
        border: "1px solid rgba(195,194,194,0.484)",
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            borderRadius: "25px",

            '&:focus': {
                width: '100%',
            },
        },
    },

}));

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

const settings = ['Profile', 'Logout'];

export default function Headbar({ toggleSidebarWidth, onSearchInputChange }) {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const getUserUpperCaseName = () => {
        if (user && user.userName) {
            return user.userName.toUpperCase();
        }
        return '';
    }
    const navigate = useNavigate();
    const [openProfileModal, setOpenProfileModal] = useState(false);

    const handleOpenProfileModal = () => {
        setOpenProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setOpenProfileModal(false);
        window.location.reload();
    };
    const getAvatarBackgroundColor = () => {
        const firstLetter = getUserUpperCaseName().charAt(0);
        return getColorCode(firstLetter);
    }
    const handleToggleSidebar = () => {
        toggleSidebarWidth();
    }
    const [anchorElUser, setAnchorElUser] = useState(null);


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleFullScreenClick = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => {
                    console.log(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
                });
            }
        }
    };
    const handleLogout = () => {
        dispatch(logout());

        navigate("/");
    };
    return (
        <div className="header-container">
            <div className="header">
                <div className="menu_bar">
                    <MenuIcon onClick={handleToggleSidebar} style={{ fontSize: "2rem", cursor: "pointer" }} />
                </div>
                <div className="search_field">
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            onChange={onSearchInputChange}
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </div>
                <div className="notification_icons">
                    <Tooltip title="Emails">
                        <EmailOutlinedIcon style={{ cursor: "pointer" }} />
                    </Tooltip>
                    <Tooltip title="Full Screen">
                        <FullscreenIcon style={{ cursor: "pointer", fontSize: "1.8rem" }} onClick={handleFullScreenClick} />
                    </Tooltip>

                </div>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="My Profile">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={getUserUpperCaseName()} sx={{ bgcolor: getAvatarBackgroundColor() }} src="/broken-image.jpg" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={setting === 'Profile' ? handleOpenProfileModal : handleLogout}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>

                </Box>
            </div>

            <Dialog open={openProfileModal} onClose={handleCloseProfileModal}>
                <DialogTitle>Profile</DialogTitle>
                <Profile onClose={handleCloseProfileModal} />
            </Dialog>
        </div>
    );
}
