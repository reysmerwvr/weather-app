import React from 'react';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoaderModal = ({ loading }) => (
    <Modal
        aria-labelledby="simple-modal-loader"
        aria-describedby="simple-modal-loader"
        open={loading}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
       <CircularProgress 
            size={24} 
            style={{ textAlign: 'center' }} 
        />   
    </Modal>
);

export default LoaderModal;
