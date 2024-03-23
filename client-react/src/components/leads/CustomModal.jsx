import React from 'react';
import { Modal, Paper } from '@mui/material';

const CustomModal = ({ isOpen, onClose, children, style }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper
                sx={{
                    position: 'absolute',
                    width: 1200,
                    height: 700,
                    maxHeight: '700px',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: "none",
                    ...style
                }}
            >
                {children}
            </Paper>
        </Modal>
    );
};

export default CustomModal;
