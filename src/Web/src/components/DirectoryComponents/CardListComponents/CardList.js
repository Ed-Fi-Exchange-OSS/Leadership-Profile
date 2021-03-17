import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import CardProfile from './CardProfile';

const CardList = (props) => {
    
    const {data} = props;
    return (
        <div>
            {
                <Row key="1" className="col-md-12">
                    { 
                    data.map((profile, index) =>{
                        return(
                            <CardProfile data={profile}></CardProfile>
                        );
                    })
                }
                </Row>               
            }
        </div>
    );
}

export default CardList;
