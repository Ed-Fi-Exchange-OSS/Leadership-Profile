import React from 'react';
import { Form, FormGroup, Label, Input, Card, CardBody, CardTitle, Alert } from 'reactstrap';
import UseForgotPassword from './UseForgotPassword';

const ForgotPassword = () => {
    const {setForgotPassword, goToLogIn, bind, error, success} = UseForgotPassword();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setForgotPassword(e);
    };

    const handleOnClick = (e) => {
        e.preventDefault();
        goToLogIn();
    };
		
    return (
        <Card className="login-card">
            <CardBody>
                <CardTitle tag="h5">Forgot Password</CardTitle>
                <Form onSubmit={e => handleOnSubmit(e)}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                        <Label for="staffUniqueId" className="mr-sm-2">Staff Unique ID</Label>
                        <Input type="staffUniqueId" name="staffUniqueId" id="staffUniqueId" placeholder="Staff Unique Id" {...bind} />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                        <Label for="userName" className="mr-sm-2">Username</Label>
                        <Input type="userName" name="userName" id="userName" placeholder="Username" {...bind} />
                    </FormGroup>
                    {error.hasError ? 
                    <Alert color="danger">
                        {error.message}
                    </Alert>
                    : <div></div>}
                    {success.isSuccess ? 
                    <Alert color="success">
                        {success.message}
                    </Alert>
                    : <div></div>}
                    {success.isSuccess ? 
                    <Alert color="success">
                        This page will redirect after 3 seconds.
                    </Alert>
                    : <div></div>}
                    <a href="#" className="login-submit" onClick={e => handleOnClick(e)}> Go Back </a>
                    <Input type="submit" value="Send Password Reset Email" className="login-submit" onClick={e => handleOnSubmit(e)}/>
                </Form>
            </CardBody>
        </Card>
    );
};

export default ForgotPassword;