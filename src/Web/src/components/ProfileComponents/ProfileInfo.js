import React, { useState } from 'react';
import { Row, Col,  Button, Card, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form, FormGroup } from 'reactstrap';
import { PersonIcon, GeoIcon, PhoneIcon, MailIcon, EducationIconNavy, RibbonIcon, CalendarIcon, IdIcon } from '../Icons';
import DataCorrectionModal from '../DataCorrectionComponent/DataCorrectionModal';

const ProfileInfo = (props) => {
    const { data } = props;

    return (
        <Card body>
            <Row>
                <Col sm="1">
                    <img src="https://tvline.com/wp-content/uploads/2014/08/school-of-rock.jpg?w=300&h=208&crop=1" alt="profile" className="rounded-circle profile-info-picture" />
                </Col>
                <Col>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="3"className="profile-card-title">{data.fullName}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="profile-info-icon"><PersonIcon /></td>
                                <td className="profile-info-text">{data.currentPosition}</td>
                                <td className="profile-info-icon"><GeoIcon /></td>
                                <td className="profile-info-text">{data.district}</td>
                                <td className="profile-info-icon"><PhoneIcon /></td>
                                <td className="profile-info-text">{data.phone}</td>
                            </tr>
                            <tr>
                                <td className="profile-info-icon"><IdIcon /></td>
                                <td className="profile-info-text">ID {data.staffUniqueId}</td>
                                <td className="profile-info-icon"><EducationIconNavy /> </td>
                                <td className="profile-info-text">{data.school}</td>
                                <td className="profile-info-icon"><MailIcon /></td>
                                <td className="profile-info-text">{data.email}</td>
                            </tr>
                            <tr>
                                <td className="profile-info-icon">{data.interestedInNextRole ? <span className="green-dot small-dot" /> : <span className="red-dot small-dot" /> }</td>
                                <td className="profile-info-text">{data.interestedInNextRole ? "Interested in next role" : "Not seeking the next role"}</td>
                                <td className="profile-info-icon"><RibbonIcon /></td>
                                <td className="profile-info-text">{data.yearsOfService} years of service</td>
                                <td className="profile-info-icon"><CalendarIcon /></td>
                                <td className="profile-info-text">Last start date: {formatDate(data.startDate)}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <DataCorrectionModal data={data}></DataCorrectionModal>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </Col>
            </Row>
        </Card>
    );
}

function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString("en-US");
};

export default ProfileInfo;