import React from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RightPointingIcon } from '../Icons';
import Sorting from './Sorting';
import PaginationButtons from './PaginationButtons';

const CreateTableList = (props) => {
    const { sort, data, setColumnSort, paging, setPage } = props;

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
                                status={sort.category === 'name' ? sort.value : null} />
                        </th>
                        <th>
                            Location
                            <Sorting onSortChange={newStatus => setColumnSort('location', newStatus)}
                                status={sort.category === 'location' ? sort.value : null} />
                        </th>
                        <th>
                            School 
                            <Sorting onSortChange={newStatus => setColumnSort('school', newStatus)}
                                status={sort.category === 'school' ? sort.value : null} />
                        </th>
                        <th>
                            Position
                            <Sorting onSortChange={newStatus => setColumnSort('position', newStatus)}
                                status={sort.category === 'position' ? sort.value : null} />
                        </th>
                        <th>
                            Years
                            <Sorting onSortChange={newStatus => setColumnSort('yearsOfService', newStatus)}
                                status={sort.category === 'yearsOfService' ? sort.value : null} />
                        </th>
                        <th>
                            Highest Degree
                            <Sorting onSortChange={newStatus => setColumnSort('highestDegree', newStatus)}
                                status={sort.category === 'highestDegree' ? sort.value : null} />
                        </th>
                        <th>
                            Major
                            <Sorting onSortChange={newStatus => setColumnSort('major', newStatus)}
                                status={sort.category === 'major' ? sort.value : null} />
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data !== [] ? data.map(profile => (
                        <tr key={profile.staffUniqueId}>
                            <td><span className="dot"></span></td>
                            <td>{profile.staffUniqueId}</td>
                            <td>{profile.lastSurname}, {profile.firstName}</td>
                            <td>{profile.location}</td>
                            <td>{profile.institution}</td>
                            <td>Teacher</td>
                            <td>{profile.yearsOfService}</td>
                            <td>{profile.highestDegree}</td>
                            <td>{profile.major}</td>
                            <td className="profile-table-row"><Link to={`profile/${profile.staffUniqueId}`}><RightPointingIcon /></Link></td>
                        </tr>)) : ''}
                        <tr className="bottom-row">
                            <td colSpan="8">
                                <span>Showing {paging.page}-10 of {paging.totalSize} Users</span>
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
        <div>
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