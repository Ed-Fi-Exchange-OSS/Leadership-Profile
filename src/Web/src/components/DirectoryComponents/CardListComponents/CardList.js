import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col, CardGroup } from 'reactstrap';
import CardProfile from "./CardProfile";

const CardList = (props) => {
    
    const {data} = props;

    return (
        <div>
            <CardGroup className>
                <CardProfile data={data[0]}></CardProfile>
                <CardProfile data={data[1]}></CardProfile>
                <CardProfile  data={data[2]}></CardProfile>
            </CardGroup>
        </div>
    );
}

export default CardList;
