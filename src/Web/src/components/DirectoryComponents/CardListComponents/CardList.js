import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import { DefaultProfile } from '../../Images';

// Will use recursion through the data. Card written multiple times right now for visual purposes 
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
                <Row>
                    {                        
                        e.map((ee, ii) => {
                            return (
                            <Col sm="4">
                                <CardProfile data={data}></CardProfile>
                            </Col>
                            );
                        })
                    }
                </Row>
                );
            })}
        </div>
    );
}

export default CardList;
