import { Tab } from 'bootstrap';
import React, { useState } from 'react';
import { Table, Button, Form, FormGroup, Input } from 'reactstrap';
import PaginationButtons from '../DirectoryComponents/PaginationButtons';
import UseRoleManagement from './UseRoleManagement';

const RoleManagement = () => {
    const { data, paging, setPaging, OnSubmit, bind } = UseRoleManagement();

    return (
        <div>
            <Form>
                <Table>
                    <tr>
                        <th>Admin</th>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Location</th>
                    </tr>
                    {data.profiles !== undefined && data.profiles !== [] ? data.profiles.map(profile => (
                        <tr key={profile.staffUniqueId}>
                            <td>
                                <FormGroup>
                                    <Input type="checkbox" defaultChecked={profile.admin} value={profile.staffUniqueId} {...bind} />
                                </FormGroup>
                            </td>
                            <td>{profile.staffUniqueId}</td>
                            <td>{profile.lastSurname}, {profile.firstName}</td>
                            <td>{profile.username}</td>
                            <td>{profile.location}</td>
                        </tr>
                    )) : ''}
                </Table>
                <Button onClick={event => OnSubmit(event)}>Save</Button>
            </Form>
            {/* <PaginationButtons paging={paging} setPage={setPage} /> */}
        </div>
    );
};

export default RoleManagement;