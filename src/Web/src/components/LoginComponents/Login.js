import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';

const Login = () => {
    return (
        <Card className="login-card">
            <CardBody>
            <CardTitle tag="h5">Login</CardTitle>
            <Form>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                    <Label for="email" className="mr-sm-2">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="Email" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 login-input">
                    <Label for="password" className="mr-sm-2">Password</Label>
                    <Input type="password" name="password" id="password" />
                </FormGroup>
                <Button className="login-submit">Submit</Button>
            </Form>
            </CardBody>
        </Card>
    );
};

export default Login;
