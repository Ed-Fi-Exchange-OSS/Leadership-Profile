import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Card, CardBody, CardTitle, Alert } from 'reactstrap';
import UseLogin from './UseLogin';
import UseRegistration from './UseRegistration';

const Registration = () => {
    const {setRegistration, error, bind} = UseRegistration();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setRegistration(e);
    };

    return (
        <div className="d-flex container justify-content-center">

            <Card className="register-card w-100 m-3">
                <CardBody>
                <CardTitle tag="h5">Register New Account</CardTitle>
                <Form onSubmit={e => handleOnSubmit(e)}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                        <Label for="username" className="mr-sm-2">Username</Label>
                        <Input type="username" name="username" id="username" placeholder="Username" {...bind} />
                        <FormText color="muted">Required.</FormText>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                        <Label for="email" className="mr-sm-2">Email</Label>
                        <Input type="email" name="email" id="email" placeholder="Email" {...bind} />
                        <FormText color="muted">Required.</FormText>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                        <Label for="password" className="mr-sm-2">Password</Label>
                        <Input type="password" name="password" id="password" placeholder="Password" {...bind} />
                        <FormText color="muted">Required.</FormText>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                        <Label for="confirmPassword" className="mr-sm-2">Confirm Password</Label>
                        <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" {...bind} />
                        <FormText color="muted">Required.</FormText>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                        <Label for="staffUniqueId" className="mr-sm-2">Staff ID</Label>
                        <Input type="text" name="staffUniqueId" id="staffUniqueId" placeholder="Your Staff Id" {...bind} />
                        <FormText color="muted">Required.</FormText>
                    </FormGroup>
                    {error.hasError ? 
                    <Alert color="danger">

                        {error.message == 'PasswordError'?
                        <div>
                            Please enter a password with the following characteristics
                            <ul>
                                <li>At least 1 upper case letter</li>
                                <li>At least 1 lower case letter</li>
                                <li>Password contains at least 8 characters</li>
                            </ul>
                        </div>
                        : <div>{error.message}</div>}
                    </Alert>
                    : <div></div>}
                    <Button className="register-submit">Submit</Button>
                </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default Registration;
