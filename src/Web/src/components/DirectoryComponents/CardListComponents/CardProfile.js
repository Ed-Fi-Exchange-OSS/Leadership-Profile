import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';

const CardProfile = (props) => {

    const {data} = props;

    return(
        <Card>
            <Row>
                <Col sm="2">
                    <img width="50px" height="50px" alt="profile" src="https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg" className="rounded-circle" />
                </Col>
                <Col>
                    <CardTitle tag="h5">{data.fullName}</CardTitle>
                    <CardText><MailIcon />{data.email}</CardText>
                    <CardText><PhoneIcon />{data.telePhone}</CardText>
                    <Row>
                        <Col>
                            <CardText><PersonIcon />{data.highestDegree}</CardText>
                        </Col>
                        <Col>
                            <CardText><GeoIcon />{data.location}</CardText>
                        </Col>
                    </Row>
                </Col>
                <Col sm="1">
                    <RightPointingIcon />
                </Col>
            </Row>
        </Card>
    )
}

export default CardProfile;