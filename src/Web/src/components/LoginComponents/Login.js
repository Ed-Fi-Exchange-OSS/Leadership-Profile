import React from 'react';
import { Form, FormGroup, Label, Input, Card, CardBody, CardTitle, Alert } from 'reactstrap';
import UseLogin from './UseLogin';

const Login = () => {
    const {setLogin, goToForgotPassword, bind, error} = UseLogin();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLogin(e);
    };

    const handleOnClick = (e) => {
        e.preventDefault();
        goToForgotPassword();
    };

    return (
        <Card className="login-card">
            <CardBody>
            <CardTitle tag="h5">Login</CardTitle>
            <Form onSubmit={e => handleOnSubmit(e)}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                    <Label for="username" className="mr-sm-2">Username</Label>
                    <Input type="username" name="username" id="username" placeholder="Username" {...bind} />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                    <Label for="password" className="mr-sm-2">Password</Label>
                    <Input type="password" name="password" id="password" {...bind} />
                </FormGroup>
                {error ? 
                <Alert color="danger">
                    Incorrect username or password.
                </Alert>
                : <div></div>}
                <Input type="submit" value="Submit" className="login-submit" />
                <a href="#"className="login-submit" onClick={e => handleOnClick(e)}>Forgot Password?</a>
            </Form>
            </CardBody>
        </Card>
    );
};

export default Login;
