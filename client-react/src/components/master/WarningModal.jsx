import React from 'react';
import { Modal, Paper } from '@mui/material';

const WarningModal = ({ isOpen, onClose, children }) => {
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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    outline: 'none',
                }}
            >
                {children}
            </Paper>
        </Modal>
    );
};

export default WarningModal;
// <Button onClick={onClose} style={{ marginTop: '10px' }}>Close</Button>
