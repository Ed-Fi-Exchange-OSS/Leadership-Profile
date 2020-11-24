import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';

// Will use recursion through the data. Card written multiple times right now for visual purposes 
const CardList = () => {
    // const [, setActiveComponent] = useState("table");

    return (
        <div>
            <Row>
                <Col sm="4">
                    <Card body onClick="">
                        <Row>
                            <Col sm="2">
                                <img width="50px" height="50px" src="https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg" className="rounded-circle" />
                            </Col>
                            <Col>
                                <CardTitle tag="h5">Dr. Angela Rivera</CardTitle>
                                <CardText><MailIcon /> arivera@mesquite.edu</CardText>
                                <CardText><PhoneIcon /> 111-222-3333</CardText>
                                <Row>
                                    <CardText><PersonIcon /> Teacher</CardText>
                                    <CardText><GeoIcon /> Mesquite</CardText>
                                </Row>
                            </Col>
                            <Col sm="1">
                                <RightPointingIcon />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col sm="4">
                    <Card body>
                        <Row>
                            <Col sm="2">
                                <img width="50px" height="50px" src="https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg" className="rounded-circle" />
                            </Col>
                            <Col>
                                <CardTitle tag="h5">Dr. Angela Rivera</CardTitle>
                                <CardText><MailIcon /> arivera@mesquite.edu</CardText>
                                <CardText><PhoneIcon /> 111-222-3333</CardText>
                                <Row>
                                    <CardText><PersonIcon /> Teacher</CardText>
                                    <CardText><GeoIcon /> Mesquite</CardText>
                                </Row>
                            </Col>
                            <Col sm="1">
                                <RightPointingIcon />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col sm="4">
                    <Card body>
                        <Row>
                            <Col sm="2">
                                <img width="50px" height="50px" src="https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg" className="rounded-circle" />
                            </Col>
                            <Col>
                                <CardTitle tag="h5">Dr. Angela Rivera</CardTitle>
                                <CardText><MailIcon /> arivera@mesquite.edu</CardText>
                                <CardText><PhoneIcon /> 111-222-3333</CardText>
                                <Row>
                                    <CardText><PersonIcon /> Teacher</CardText>
                                    <CardText><GeoIcon /> Mesquite</CardText>
                                </Row>
                            </Col>
                            <Col sm="1">
                                <RightPointingIcon />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default CardList;
