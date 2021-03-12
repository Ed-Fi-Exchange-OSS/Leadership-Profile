import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import CardProfile from './CardProfile';

const CardList = (props) => {
    
    const {data} = props;
    const dataTable = [];

    for(var i = 0; i <= data.length; i = i+3)
    {
        dataTable.push(data.splice(i, i+3));
    }

    return (
        <div>
            {dataTable.map((e,i) => {
                return(
                    <div>
                        <br></br>
                        <Row key={i}>
                            {                        
                                e.map((ee, ii) => {
                                    return (
                                    <Col sm="4" key={ii}>
                                        <CardProfile data={ee}></CardProfile>
                                    </Col>
                                    );
                                })
                            }
                        </Row>
                    </div>
                );
            })}
        </div>
    );
}

export default CardList;
