import React, { useState } from 'react';
import { Row, Col,  Button, Card, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form, FormGroup } from 'reactstrap';
import { PersonIcon, GeoIcon, PhoneIcon, MailIcon, EducationIconNavy, RibbonIcon, CalendarIcon, IdIcon, ChartIcon } from '../Icons';
import { formatDate } from '../../utils/date';

const ProfileInfo = (props) => {
    const { data } = props;

    return (
        <Card body>
            <Row>
                <Col sm="3" lg="2">
                    <img src="https://tvline.com/wp-content/uploads/2014/08/school-of-rock.jpg?w=300&h=208&crop=1" alt="profile" className="rounded-circle profile-info-picture" />
                </Col>
                <Col>
                    <table className="profile-card-table">
                        <thead>
                            <tr>
                                <th colSpan="3"className="profile-card-title">{data.fullName}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="profile-info-icon"><PersonIcon /></td>
                                <td className="profile-info-text">{data.currentPosition}</td>
                                <td className="profile-info-icon"><RibbonIcon /></td>
                                <td className="profile-info-text">{data.yearsOfService} years of service</td>
                                <td className="profile-info-icon"><PhoneIcon /></td>
                                <td className="profile-info-text">{data.phone}</td>
                            </tr>
                            <tr>
                                <td className="profile-info-icon"><EducationIconNavy /> </td>
                                <td className="profile-info-text">{data.school}</td>
                                <td className="profile-info-icon"><CalendarIcon /></td>
                                <td className="profile-info-text">Years in role: {data.yearsInLastRole}</td>        
                                <td className="profile-info-icon"><MailIcon /></td>
                                <td className="profile-info-text"><a href={ "mailto:" + data.email}>{data.email}</a></td>
                            </tr>
                            <tr>
                                <td className="profile-info-icon"><ChartIcon isDark={false} /></td>
                                <td className="profile-info-text">Aspire</td>                                
                            </tr>
                        </tbody>
                    </table>
                    
                </Col>
            </Row>
        </Card>
    );
}

export default ProfileInfo;