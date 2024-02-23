// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
