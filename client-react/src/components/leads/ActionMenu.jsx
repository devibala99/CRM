import React, { useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ActionMenu = ({ lead, handleEdit, handleDeleteClick, handleViewLead, handleClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickAction = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClickAction}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { handleClose(); handleEdit(lead); }} style={{ fontSize: '14px' }}>
                    Update Lead
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); handleDeleteClick(lead); }} style={{ fontSize: '14px' }}>
                    Delete Lead
                </MenuItem>
                {/*   <MenuItem onClick={() => { handleClose(); handleViewLead(lead); }} style={{ fontSize: '14px' }}>
                    View Lead
                </MenuItem>
                  <MenuItem onClick={() => { handleClose(); handleClick(lead); }} style={{ fontSize: '14px' }}>
                    Convert To Deal
                </MenuItem> * */}
            </Menu>
        </>
    );
};

export default ActionMenu
