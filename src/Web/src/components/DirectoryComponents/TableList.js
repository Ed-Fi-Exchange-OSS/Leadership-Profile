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
                    <tr>
                        <th></th>
                        <th>
                            ID                
                        </th>
                        <th>
                            Name
                            <Sorting onSortChange={newStatus => setColumnSort('name', newStatus)}
                                status={sort.category === 'name' ? sort.value : null} />
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
                    </tr>
                </thead>
                <tbody>
                    {data !== [] ? data.map(profile => (
                        <tr key={profile.id}>
                            <td><span className="dot"></span></td>
                            <td>{profile.staffUniqueId}</td>
                            <td><Link to={`profile/${profile.staffUniqueId}`}>{profile.lastSurname}, {profile.firstName}</Link></td>
                            <td>{profile.institution}</td>
                            <td>{profile.assignment}</td>
                            <td>{profile.yearsOfService}</td>
                            <td>{profile.degree}</td>
                            <td>{profile.major}</td>
                        </tr>)) : ''}
                        <tr className="bottom-row">
                            <td colSpan="7">
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