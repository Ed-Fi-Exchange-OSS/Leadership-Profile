import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col, CardGroup } from 'reactstrap';
import CardProfile from "./CardProfile";

const CardList = (props) => {
    
    const {data} = props;

    return (
        <div>
            <Row>
                <Col>
                    <CardProfile data={data[0]}></CardProfile>
                </Col>
                <Col>
                    <CardProfile data={data[1]}></CardProfile>
                </Col>
                <Col>
                    <CardProfile  data={data[2]}></CardProfile>
                </Col>
            </Row>
        </div>
    );
}

export default CardList;
