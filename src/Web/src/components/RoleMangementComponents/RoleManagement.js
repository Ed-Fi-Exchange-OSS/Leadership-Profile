import React from 'react';
import { Table, Button, Form, FormGroup, Input, Alert } from 'reactstrap';
import PaginationButtons from '../DirectoryComponents/PaginationButtons';
import UseRoleManagement from './UseRoleManagement';
import BreadcrumbList from '../Breadcrumb';

const RoleManagement = () => {
    const { data, paging, SetPage, OnSubmit, error, bind } = UseRoleManagement();

    return (
        <div>
            <div className='directory-div'>
                <h2 className='directory-title role-card-title'>Role Managment</h2>
                <div className="directory-subtitle-controls">
                    <BreadcrumbList currentPage="home" />
                </div>
            </div>
            {error ?
                <Alert color="danger">
                    Unable to load data.
                </Alert>
                : ''}
            <Form>
                <Table striped className="directory-table">
                    <thead>
                        <tr>
                            <th>Admin</th>
                            <th>User</th>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>                        
                        {data.profiles !== undefined && data.profiles !== [] ? data.profiles.map(profile => (
                            <tr key={profile.id}>
                                <td>
                                    <FormGroup className="isdamin-checkbox">
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
                            {/* <td colSpan="4">
                                <Button onClick={event => OnSubmit(event)}>Save</Button>
                            </td> */}
                            <td colSpan="4">
                                <span>Showing {paging.page}-10 of {paging.totalSize} Users</span>
                            </td>
                            <td colSpan="1" className="pagination-buttons-container">
                                <PaginationButtons paging={paging} setPage={SetPage} />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                
                <Button size="lg" onClick={event => OnSubmit(event)}>Save</Button>
            </Form>
        </div>
    );
};

export default RoleManagement;