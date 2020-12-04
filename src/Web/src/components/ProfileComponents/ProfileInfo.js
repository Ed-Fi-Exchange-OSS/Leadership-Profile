import React from 'react';
import { Row, Col, Card, CardTitle, CardText } from 'reactstrap';
import { PersonIcon, GeoIcon, PhoneIcon, MailIcon, EducationIcon, RibbonIcon, CalendarIcon, IdIcon } from '../Icons';

const ProfileInfo = () => {
    return (
        <Card body>
            <Row>
                <Col sm="1">
                    <img width="88px" height="88px" src="https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg" alt="profile" className="rounded-circle" />
                </Col>
                <Col>
                    <Row>
                        <CardTitle tag="h5">Dr. Angel Rivera</CardTitle>
                    </Row>
                    <Row>
                        <Col>
                            <CardText><PersonIcon /> Principal</CardText>
                            <CardText><IdIcon />ID 12345</CardText>
                            <CardText>Interested in next role</CardText>
                        </Col>
                        <Col>
                            <CardText><GeoIcon /> Mesquite District</CardText>
                            <CardText><EducationIcon /> Mesquite High School</CardText>
                            <CardText><RibbonIcon /> 5 years of service</CardText>
                        </Col>
                        <Col>
                            <CardText><PhoneIcon /> +1 123 123 1233</CardText>
                            <CardText><MailIcon /> arivera@mesquite.edu</CardText>
                            <CardText><CalendarIcon /> Last start date: 11/11/2015</CardText>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}

export default ProfileInfo;