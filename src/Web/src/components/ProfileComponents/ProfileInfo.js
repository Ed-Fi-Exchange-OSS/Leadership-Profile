import React, { useState } from 'react';
import { Row, Col,  Button, Card, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form, FormGroup } from 'reactstrap';
import { PersonIcon, GeoIcon, PhoneIcon, MailIcon, EducationIconNavy, RibbonIcon, CalendarIcon, IdIcon } from '../Icons';
import UseFeedbackModal from './UseFeedbackModal';

const ProfileInfo = (props) => {
    const { data } = props;
    const {sendFeedback, bind} = UseFeedbackModal();
    
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const data = {"sui": e.currentTarget[0].value,
            "fullname": e.currentTarget[1].value,
            "email": e.currentTarget[2].value}
        sendFeedback(data);

        setModal(false);
    };

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
                                 <a href="#" className="modal-link" onClick={toggle}>Request Data Correction</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Modal isOpen={modal} toggle={toggle} fullscreen="sm">
                        <ModalHeader toggle={toggle}>Data Correction Request Form</ModalHeader>
                        <ModalBody>
                            <Form id="feedback-form" onSubmit={e => handleOnSubmit(e)}>
                                <Input type="hidden" name="staffUniqueId" id="staffUniqueId" value={data.staffUniqueId}></Input>
                                <Input type="hidden" name="fullName" id="fullName" value={data.fullName}></Input>
                                <Input type="hidden" name="email" id="email" value={data.email}></Input>

                                <div className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="lblsubject" className="label-feedback mr-sm-2">ID: </Label>
                                    <Label for="lblsubject" className="mr-sm-2">{data.staffUniqueId}</Label>
                                </div>
                                <div className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="staffsubject" className="label-feedback mr-sm-2">Name: </Label>
                                    <Label for="staffsubject" className="mr-sm-2">{data.fullName}</Label>
                                </div>
                                <div className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="emailsubject" className="label-feedback mr-sm-2">Email: </Label>
                                    <Label for="emailsubject" className="mr-sm-2">{data.email}</Label>
                                </div>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="subject" className="label-feedback mr-sm-2">Subject</Label>
                                    <Input type="text" placeholder="" name="subject" id="subject" value="Data Correction Request" {...bind}/>
                                </FormGroup>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="messagescontent" className="label-feedback mr-sm-2">Description</Label>
                                    <Input type="textarea" name="messagescontent" id="messagecontent"  {...bind}/>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" form="feedback-form">Submit</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
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