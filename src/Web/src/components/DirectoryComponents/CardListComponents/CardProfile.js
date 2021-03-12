import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import { DefaultProfile } from '../../images'

const CardProfile = (props) => {

    const {data} = props;

    return(
        <Card>
            <Row>
                <Col sm="2">
                    <DefaultProfile></DefaultProfile>
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