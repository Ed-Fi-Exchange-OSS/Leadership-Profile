import React from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RightPointingIcon } from '../../Icons';
import Sorting from '../Sorting';
import PaginationButtons from '../PaginationButtons';
import PaginationDetails from '../PaginationDetails'

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
                            Years
                            <Sorting onSortChange={newStatus => setColumnSort('yearsOfService', newStatus)}
                                status={sort.category === 'yearsOfService' ? sort.value : null} />
                        </th>
                        <th>
                            Position
                            <Sorting onSortChange={newStatus => setColumnSort('position', newStatus)}
                                status={sort.category === 'position' ? sort.value : null} />
                        </th>                        
                        <th>
                            Start Date
                            <Sorting onSortChange={newStatus => setColumnSort('startDate', newStatus)}
                                status={sort.category === 'startDate' ? sort.value : null} />
                        </th>                        
                        <th>
                            Certificate
                            <Sorting onSortChange={newStatus => setColumnSort('certificate', newStatus)}
                                status={sort.category === 'certificate' ? sort.value : null} />
                        </th>                        
                        <th>
                            Issuance Date
                            <Sorting onSortChange={newStatus => setColumnSort('issuanceDate', newStatus)}
                                status={sort.category === 'issuanceDate' ? sort.value : null} />
                        </th>
                        <th>
                            Highest Degree
                            <Sorting onSortChange={newStatus => setColumnSort('degree', newStatus)}
                                status={sort.category === 'degree' ? sort.value : null} />
                        </th>                        
                        <th>
                            Rating Category 
                            <Sorting onSortChange={newStatus => setColumnSort('ratingCategory', newStatus)}
                                status={sort.category === 'ratingCategory' ? sort.value : null} />
                        </th>                        
                        <th>
                            Rating SubCategory  
                            <Sorting onSortChange={newStatus => setColumnSort('ratingSubCategory', newStatus)}
                                status={sort.category === 'ratingSubCategory' ? sort.value : null} />
                        </th>                       
                        <th>
                            Rating  
                            <Sorting onSortChange={newStatus => setColumnSort('rating', newStatus)}
                                status={sort.category === 'rating' ? sort.value : null} />
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data !== [] ? data.map(profile => (
                        <tr key={profile.id}>
                            <td><span className="dot"></span></td>
                            <td>{profile.staffUniqueId}</td>
                            <td>{profile.lastSurName}, {profile.firstName}</td>
                            <td>{profile.yearsOfService}</td>
                            <td>{profile.position}</td>
                            <td>{profile.startDate}</td>
                            <td>{profile.certificate}</td>
                            <td>{profile.issuanceDate}</td>
                            <td>{profile.degree}</td>
                            <td>{profile.ratingCategory}</td>
                            <td>{profile.ratingSubCategory}</td>
                            <td>{profile.rating}</td>
                            <td className="profile-table-row"><Link to={`../profile/${profile.staffUniqueId}`}><RightPointingIcon /></Link></td>
                        </tr>)) : ''}
                        <tr className="bottom-row">
                            <td colSpan="11">
                                <PaginationDetails paging={paging} />
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

const AdvancedTableList = (props) => (
    <CreateTableList
        sort={props.sort}
        data={props.data}
        setColumnSort={props.setColumnSort}
        paging={props.paging}
        setPage={props.setPage}
    />
);

export default AdvancedTableList;