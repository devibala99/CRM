
import React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import logo from "./assets/kitkat-removebg-preview.png"
import { useNavigate } from 'react-router-dom';
import SidebarItems from './SidebarItems';
// redux
import { useSelector } from 'react-redux';
import { selectUser } from "../../../client-react/src/components/features/loginUserSlice";
import './sidebar.css';
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
const Sidebar = ({ width, collapsed, items }) => {
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const sidebarStyle = {
        width: collapsed ? '60px' : `${width}px`,
        transition: 'width 0.3s ease',
    };
    const getUserUpperCaseName = () => {
        if (user && user.name) {
            return user.name.toUpperCase();
        }
        return '';
    }

    const navigateHome = () => {
        navigate("/home");
    }

    return (
        <CustomScrollbar className="sidebar" style={sidebarStyle}>
            {sidebarStyle.width === '60px' ?
                <div className="min-side-header">
                    <Avatar sx={{ bgcolor: '#0090dd' }}>K</Avatar>

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
                            <Avatar alt={getUserUpperCaseName()} src="/static/images/avatar/1.jpg" />

                        </StyledBadge>
                        <h4 className='profile-name'>{getUserUpperCaseName()}</h4>
                    </div>

                </div>
            }

            {
                items.map((item) => <SidebarItems key={item.id} item={item} sidebarWidth={sidebarStyle.width} />)
            }
        </CustomScrollbar>
    )


}
export default Sidebar;


