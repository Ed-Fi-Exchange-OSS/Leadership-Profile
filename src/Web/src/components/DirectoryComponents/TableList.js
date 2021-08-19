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
                            Name
                            <Sorting onSortChange={newStatus => setColumnSort('name', newStatus)}
                                status={sort.category === 'name' ? sort.value : null} />
                        </th>
                        <th>
                            School 
                        </th>
                        <th>
                            Position
                        </th>
                        <th>
                            Years
                        </th>
                        <th>
                            Highest Degree
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data !== [] ? data.map(profile => (
                        <tr key={profile.staffUniqueId}>
                            <td><span className="dot"></span></td>
                            <td><Link to={`profile/${profile.staffUniqueId}`}>{profile.lastSurname}, {profile.firstName}</Link></td>
                            <td>{profile.institution}</td>
                            <td>{profile.assignment}</td>
                            <td>{profile.yearsOfService}</td>
                            <td>{profile.degree}</td>
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