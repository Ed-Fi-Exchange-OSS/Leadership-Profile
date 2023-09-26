// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form, FormGroup } from 'reactstrap';
import UseDataCorrectionModal from './UseDataCorrectionModal';

const DataCorrectionModal = (props) => {
    const { data, isOpen } = props;
    const {sendFeedback, bind} = UseDataCorrectionModal();

    const [modal, setModal] = useState(isOpen);
    const toggle = () => setModal(!modal);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const data = {"sui": e.currentTarget[0].value,
            "fullname": e.currentTarget[1].value,
            "email": e.currentTarget[2].value}
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
                        <Input type="hidden" name="staffUniqueId" id="staffUniqueId" value={data.staffUniqueId}></Input>
                        <Input type="hidden" name="fullName" id="fullName" value={data.fullName}></Input>
                        <Input type="hidden" name="email" id="email" value={data.email}></Input>

                        <div className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="lblsubject" className="label-feedback mr-sm-2">StaffUniqueId: </Label>
                            <Label for="lblsubject" className="mr-sm-2">{data.staffUniqueId}</Label>
                        </div>
                        <div className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="staffsubject" className="label-feedback mr-sm-2">Staff Name: </Label>
                            <Label for="staffsubject" className="mr-sm-2">{data.fullName}</Label>
                        </div>
                        <div className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="emailsubject" className="label-feedback mr-sm-2">Staff Email: </Label>
                            <Label for="emailsubject" className="mr-sm-2">{data.email}</Label>
                        </div>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="subject" className="label-feedback mr-sm-2">Subject</Label>
                            <Input type="text" name="subject" id="subject" {...bind}/>
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
