// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Sorting from './Sorting';
import PaginationButtons from './PaginationButtons';
import PaginationDetails from "./PaginationDetails"

const CreateTableList = (props) => {
    const { sort, data, setColumnSort, paging, setPage } = props;

    function RenderTable(data) {
        return (
            <Table striped className="directory-table">
                <thead>
                    <tr><th></th>
                        <th width="20%">
                            {/* Name */}
                            NAME
                            <Sorting onSortChange={newStatus => setColumnSort('name', newStatus)}
                                status={sort.category === 'name' ? sort.value : null} />
                        </th>
                        <th width="20%">
                            {/* Position */}
                            POSITION
                        </th>
                        <th width="30%">
                            {/* School  */}
                            SCHOOL
                        </th>
                        <th width="10%">
                            {/* Years */}
                            YEARS
                        </th>
                        <th width="20%">
                            {/* Degree */}
                            DEGREE
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data !== [] ? data.map(profile => (
                        <tr key={profile.staffUniqueId}>
                            <td></td>
                            <td width="20%"><Link to={`profile/${profile.staffUniqueId}`}>{profile.lastSurname}, {profile.firstName}</Link></td>
                            <td width="20%">{profile.assignment}</td>
                            <td width="20%">{profile.institution}</td>
                            <td width="20%">{profile.yearsOfService}</td>
                            <td width="20%">{profile.degree}</td>
                        </tr>)) : ''}
                        <tr className="bottom-row">
                            <td colSpan="5">
                                <PaginationDetails paging={paging} count={data?.length} />
                            </td>
                            <td colSpan="2" className="pagination-buttons-container">
                                <PaginationButtons paging={paging} setPage={setPage} />
                            </td>
                        </tr>
                </tbody>
            </Table>
        );
    }

    return (
        <div className="table-responsive">
            {data != null ? RenderTable(data) : ''}
        </div>
    );
}

const TableList = (props) => (
    <CreateTableList
        sort={props.sort}
        data={props.data}
        setColumnSort={props.setColumnSort}
        paging={props.paging}
        setPage={props.setPage}
    />
);

export default TableList;
