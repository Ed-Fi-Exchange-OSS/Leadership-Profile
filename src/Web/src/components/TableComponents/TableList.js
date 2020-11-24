import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { RightPointingIcon, SortIcon } from '../Icons'
import Sorting from './Sorting';
import UseTableList from './UseTableList';

// class List extends Component {
//     render() {
//         return (
//             <div>
//                 <Table striped className="directory-table">
//                     <thead>
//                     <tr>
//                         <th></th>
//                         <th>ID</th>
//                         <th>Name</th>
//                         <th>District</th>
//                         <th>School</th>
//                         <th>Position</th>
//                         <th>Years</th>
//                         <th>Degree</th>
//                         <th></th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>                    
//                                 <span className="dot"></span>
//                             </td>
//                             <td>446235</td>
//                             <td>Angel Rivera</td>
//                             <td>Mesquite District</td>
//                             <td>Mesquite High School</td>
//                             <td>Teacher</td>
//                             <td>5</td>
//                             <td>Ph.D.</td>
//                             <td><RightPointingIcon /></td>
//                         </tr>
//                     </tbody>
//                 <tfoot>
//                 <span>Showing 1-10 of 340 Users</span>
//                     <Pagination size="sm" aria-label="Page navigation example">
//                         <PaginationItem>
//                             <PaginationLink previous href="#" />
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink href="#">
//                             1
//                             </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink href="#">
//                             2
//                             </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink href="#">
//                             3
//                             </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink next href="#" />
//                         </PaginationItem>
//                     </Pagination>
//                 </tfoot>
//                 </Table>
//                 </div>
//         );
//     }
// }

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
                            {console.log(sort)}
                            <Sorting onSortChange={newStatus => setColumnSort('id', newStatus)}
                                status={sort.category === 'id' ? sort.value : null} />
                        </th>
                        <th>Name <SortIcon /></th>
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
                            <td>{profile.firstName} {profile.lastName}</td>
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