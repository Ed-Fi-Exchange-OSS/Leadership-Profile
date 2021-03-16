import { set } from 'js-cookie';
import React, { useRef, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form, FormGroup } from 'reactstrap';
import UseDataCorrectionModal from './UseDataCorrectionModal';

const DataCorrectionModal = (props) => {
    const { data, isOpen } = props;
    const {sendFeedback, bind} = UseDataCorrectionModal();

    const [modal, setModal] = useState(isOpen);
    const toggle = () => setModal(!modal); 

    const staffUniqueId = useRef(null);
    const fullName = useRef(null);
    const email = useRef(null);
    const phone = useRef(null);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const data = {"sui": staffUniqueId.current.props.value,
            "fullname": fullName.current.props.value,
            "email": email.current.props.value,
            "phone": phone.current.props.value}
        sendFeedback(data);

        setModal(false);
    };

    return(
        <div>
            <a href="#" className="modal-link" onClick={toggle}>Request Data Correction</a>
            <Modal isOpen={modal} toggle={toggle} fullscreen="sm">
                <ModalHeader toggle={toggle}>Feedback</ModalHeader>
                <ModalBody>
                    <Form id="feedback-form" onSubmit={e => handleOnSubmit(e)}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="lblsubject" className="label-feedback mr-sm-2">StaffUniqueId: </Label>
                            <Label for="lblsubject" className="mr-sm-2">{data.staffUniqueId}</Label>
                            <Input type="hidden" ref={staffUniqueId} name="staffUniqueId" id="staffUniqueId" value={data.staffUniqueId} {...bind}></Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="staffsubject" className="label-feedback mr-sm-2">Staff Name: </Label>
                            <Label for="staffsubject" className="mr-sm-2">{data.fullName}</Label>
                            <Input type="hidden" ref={fullName} name="fullName" id="fullName" value={data.fullName} {...bind}></Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="emailsubject" className="label-feedback mr-sm-2">Staff Email: </Label>
                            <Label for="emailsubject" className="mr-sm-2">{data.email}</Label>
                            <Input type="hidden" ref={email} name="email" id="email" value={data.email} {...bind}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="hidden" ref={phone} name="phone" id="phone" value={data.phone} {...bind}></Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="subject" className="label-feedback mr-sm-2">Subject</Label>
                            <Input type="text" name="subject" id="subject" value="Data Correction Request" {...bind}/>
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
        </div>        
    );
}

export default DataCorrectionModal;