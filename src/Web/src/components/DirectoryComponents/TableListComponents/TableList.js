import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { RightPointingIcon, SortIcon } from '../../Icons'
import Sorting from './Sorting';
import UseTableList from './UseTableList';

function CreateTableList() {
    const { setColumnSort, setSort, sort, data, paging, setPage } = UseTableList();

    function RenderTable(data) {
        return (
            <Table striped className="directory-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            ID 
                            <Sorting onSortChange={newStatus => setColumnSort('id', newStatus)}
                                status={sort.category === 'id' ? sort.value : null} />
                        </th>
                        <th>
                            Name
                            <Sorting onSortChange={newStatus => setColumnSort('name', newStatus)}
                                status={sort.category === 'id' ? sort.value : null} />
                        </th>
                        <th>District <SortIcon /></th>
                        <th>School <SortIcon /></th>
                        <th>Position <SortIcon /></th>
                        <th>Years <SortIcon /></th>
                        <th>Degree <SortIcon /></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data !== [] ? data.map(profile => (
                        <tr>
                            <td><span className="dot"></span></td>
                            <td>{profile.id}</td>
                            <td>{profile.lastName}, {profile.firstName}</td>
                            <td>Mesquite District</td>
                            <td>Mesquite High School</td>
                            <td>Teacher</td>
                            <td>5</td>
                            <td>Ph.D.</td>
                            <td><RightPointingIcon /></td>
                        </tr>)) : ''}
                </tbody>
            </Table>
        );
    }

    return (
        <div>
            {RenderTable(data)}
        </div>
    );
}

const TableList = () => (
    <CreateTableList />
);

export default TableList;