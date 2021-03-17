import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import { DefaultProfile } from '../../images'

const CardProfile = (props) => {

    const {data} = props;

    return(
        <div className="col-md-4 col-sm-4 card-spacing">
            <Card>
                <Row sm="3">
                    <Col sm="2">
                        <DefaultProfile></DefaultProfile>
                    </Col>
                    <Col sm="9">
                        <CardTitle tag="h5">{data.fullName}</CardTitle>
                        <CardText><MailIcon />{data.email}</CardText>
                        <CardText><PhoneIcon />{data.telePhone}</CardText>
                    </Col>
                    <Col sm="1">
                        <RightPointingIcon />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size:3, offset:2}}>
                        <CardText><PersonIcon />{data.highestDegree}</CardText>
                    </Col>
                    <Col>
                        <CardText><GeoIcon />{data.location}</CardText>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default CardProfile;