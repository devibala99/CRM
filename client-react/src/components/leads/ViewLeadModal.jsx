import React from 'react';
import { Modal, Paper } from '@mui/material';

const ViewLeadModal = ({ isOpen, onClose, children }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="view-lead-modal-title"
            aria-describedby="view-lead-modal-description"
        >
            <Paper
                sx={{
                    position: 'absolute',
                    width: 700,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                }}
            >
                {children}
            </Paper>
        </Modal>
    );
};

export default ViewLeadModal;

