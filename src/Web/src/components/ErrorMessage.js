import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = () => {
    return (
        <Alert color="danger">
            Error - Unable to load data.
        </Alert>
    );
};

export default ErrorMessage;