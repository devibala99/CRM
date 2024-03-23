import React from 'react';
import { Modal, Typography } from '@mui/material';

const DeleteSuccessPopup = ({ message, open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem', borderRadius: '5px', color: "#2196f3" }}>
                <Typography variant="h2">{message}</Typography>
            </div>
        </Modal>
    );
};

export default DeleteSuccessPopup;

