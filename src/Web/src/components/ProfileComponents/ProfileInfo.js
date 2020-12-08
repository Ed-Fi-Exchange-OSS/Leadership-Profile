import React from 'react';
import { Row, Col, Card, CardTitle, CardText, Table } from 'reactstrap';
import { PersonIcon, GeoIcon, PhoneIcon, MailIcon, EducationIconNavy, RibbonIcon, CalendarIcon, IdIcon } from '../Icons';

const ProfileInfo = () => {
    return (
        <Card body>
            <Row>
                <Col sm="1">
                    <img width="88px" height="88px" src="https://hips.hearstapps.com/countryliving.cdnds.net/17/47/1511194376-cavachon-puppy-christmas.jpg" alt="profile" className="rounded-circle" />
                </Col>
                <Col>
                    <table>
                        <thead>
                            <th colSpan="3"className="profile-card-title">Dr. Angel Rivera</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="profile-info-icon"><PersonIcon /></td>
                                <td className="profile-info-text">Principal</td>
                                <td className="profile-info-icon"><GeoIcon /></td>
                                <td className="profile-info-text">Mesquite District</td>
                                <td className="profile-info-icon"><PhoneIcon /></td>
                                <td className="profile-info-text">+1 123 123 1233</td>
                            </tr>
                            <tr>
                                <td className="profile-info-icon"><IdIcon /></td>
                                <td className="profile-info-text">ID 12345</td>
                                <td className="profile-info-icon"><EducationIconNavy /> </td>
                                <td className="profile-info-text">Mesquite High School</td>
                                <td className="profile-info-icon"><MailIcon /></td>
                                <td className="profile-info-text">arivera@mesquite.edu</td>
                            </tr>
                            <tr>
                                <td className="profile-info-icon"><span className="green-dot" /></td>
                                <td className="profile-info-text">Interested in next role</td>
                                <td className="profile-info-icon"><RibbonIcon /></td>
                                <td className="profile-info-text">5 years of service</td>
                                <td className="profile-info-icon"><CalendarIcon /></td>
                                <td className="profile-info-text">Last start date: 11/11/2015</td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Card>
    );
}

export default ProfileInfo;
