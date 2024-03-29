// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { Form, FormGroup, Label, Input, Card, CardBody, CardTitle, Alert } from 'reactstrap';
import UseResetPassword from './UseResetPassword';

const ResetPassword = () => {
    const { setResetPassword, bind, error, success } = UseResetPassword();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setResetPassword(e);
    };

	return (
        <Card className="login-card">
            <CardBody>
                <CardTitle tag="h5">Reset Password</CardTitle>
                <Form onSubmit={e =>
                    handleOnSubmit(e)}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                        <Label for="newPassword" className="mr-sm-2">New Password</Label>
                        <Input type="password" name="newPassword" id="newPassword" placeholder="New Password" {...bind} />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                        <Label for="confirmNewPassword" className="mr-sm-2">Confirm New Password</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" {...bind} />
                    </FormGroup>
                    {error.hasError ?
                    <Alert color="danger">
                        {error.message}
                    </Alert >
                    : <div></div>
                    }
                    {success.isSuccess ?
                    <Alert color="success">
                        {success.message}
                    </Alert>
                    : <div></div>
                    }
                    {success.isSuccess ?
                    <Alert color="success">
                        This page will redirect after 3 seconds.
                    </Alert>
                    : <div></div>
                    }
                    <Input type="submit" value="Submit" className="login-submit" />
                </Form>
            </CardBody>
        </Card>
    );
};

export default ResetPassword;
