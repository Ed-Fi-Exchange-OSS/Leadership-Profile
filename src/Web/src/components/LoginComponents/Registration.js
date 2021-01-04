import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';

const Registration = () => {
    return (
        <Card className="register-card">
            <CardBody>
            <CardTitle tag="h5">Register New Account</CardTitle>
            <Form>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="email" className="mr-sm-2">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="Email" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="password" className="mr-sm-2">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="Password" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="confirmPassword" className="mr-sm-2">Confirm Password</Label>
                    <Input type="password" name="password" id="confirmPassword" placeholder="Confirm password" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="firstName" className="mr-sm-2">First Name</Label>
                    <Input type="firstName" name="firstName" id="firstName" placeholder="John" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="lastName" className="mr-sm-2">Last Name</Label>
                    <Input type="lastName" name="lastName" id="lastName" placeholder="Smith" />
                </FormGroup>
                <Button className="register-submit">Submit</Button>
            </Form>
            </CardBody>
        </Card>
    );
};

export default Registration;
