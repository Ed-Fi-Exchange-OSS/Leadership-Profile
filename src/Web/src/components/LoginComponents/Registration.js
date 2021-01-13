import React from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';

const Registration = () => {
    const {setRegistration, formComplete} = UseRegistration();
    const {setLogin} = UseLogin();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const registrationPromise = await setRegistration(e);
        const loginPromise = await setLogin(e);
        Promise.all([registrationPromise, loginPromise]).then((values) => {
            console.log(values);
        }).catch(error => console.error(error));
    };

    return (
        <Card className="register-card">
            <CardBody>
            <CardTitle tag="h5">Register New Account</CardTitle>
            <Form onSubmit={e => handleOnSubmit(e)}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="email" className="mr-sm-2">Email</Label>
                    <Input required type="email" name="email" id="email" placeholder="Email" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="password" className="mr-sm-2">Password</Label>
                    <Input required type="password" name="password" id="password" placeholder="Password" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="confirmPassword" className="mr-sm-2">Confirm Password</Label>
                    <Input required type="password" name="password" id="confirmPassword" placeholder="Confirm password" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="staffUniqueId" className="mr-sm-2">Email</Label>
                    <Input required type="text" id="staffUniqueId" placeholder="Your Staff Id" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="firstName" className="mr-sm-2">First Name</Label>
                    <Input required  type="text" name="firstName" id="firstName" placeholder="John" />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0 register-input">
                    <Label for="lastName" className="mr-sm-2">Last Name</Label>
                    <Input required type="text" name="lastName" id="lastName" placeholder="Smith" />
                </FormGroup>
                {!formComplete.valid ? 
                <Alert color="danger">
                   {formComplete.message}
                </Alert>
                : <div></div>}
                <Button className="register-submit">Submit</Button>
            </Form>
            </CardBody>
        </Card>
    );
};

export default Registration;
