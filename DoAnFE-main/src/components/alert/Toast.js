import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const Toast = ({ msg, handleShow, type }) => {
  const icons = {
    Success: 'fas fa-check-circle',
    Info: 'fas fa-info-circle',
    Error: 'fas fa-exclamation-triangle',
  };

  return (
    <div id="toast_nofication">
      <Alert
        onClose={() => {
          handleShow();
        }}
        severity={`${type.toLowerCase()}`}
      >
        <AlertTitle>{type}</AlertTitle>
        {msg}
      </Alert>
    </div>
  );
};

export default Toast;
