import React from 'react';
import { Table, Button, Form, FormGroup, Input, Alert } from 'reactstrap';
import PaginationButtons from '../DirectoryComponents/PaginationButtons';
import UseRoleManagement from './UseRoleManagement';

const RoleManagement = () => {
    const { data, paging, SetPage, OnSubmit, error, bind } = UseRoleManagement();

    return (
        <div>
            {error ?
                <Alert color="danger">
                    Unable to load data.
                </Alert>
                : ''}
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
                        <tr key={profile.id}>
                            <td>
                                <FormGroup>
                                    <Input type="checkbox" defaultChecked={profile.isAdmin} 
                                    value={profile.staffUniqueId} {...bind} />
                                </FormGroup>
                            </td>
                            <td>{profile.staffUniqueId}</td>
                            <td>{profile.lastSurname}, {profile.firstName}</td>
                            <td>{profile.username}</td>
                            <td>{profile.location}</td>
                        </tr>
                    )) : ''}
                    <tr className="bottom-row">
                        <td colSpan="4">
                            <Button onClick={event => OnSubmit(event)}>Save</Button>
                        </td>
                        <td colSpan="1" className="pagination-buttons-container">
                            <PaginationButtons paging={paging} setPage={SetPage} />
                        </td>
                    </tr>
                </Table>
            </Form>
        </div>
    );
};

export default RoleManagement;