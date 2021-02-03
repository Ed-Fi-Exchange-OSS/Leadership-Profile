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
                    <Label for="staffuniqueid" className="mr-sm-2">Staff Unique ID</Label>
                    <Input type="staffuniqueid" name="staffuniqueid" id="staffuniqueid" placeholder="Staffuniqueid" {...bind} />
                </FormGroup>
				<FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                    <Label for="username" className="mr-sm-2">Username</Label>
                    <Input type="username" name="username" id="username" placeholder="Username" {...bind} />
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
				{/* <Input type="button" value="Go Back" className="login-submit" onClick={e => handleOnClick(e)}/> */}
                <a href="#" className="login-submit" onClick={e => handleOnClick(e)}> Go Back </a>
                <Input type="submit" value="Send Password Reset Email" className="login-submit" onClick={e => handleOnSubmit(e)}/>
            </Form>
            </CardBody>
        </Card>
    );
};

export default ForgotPassword;
