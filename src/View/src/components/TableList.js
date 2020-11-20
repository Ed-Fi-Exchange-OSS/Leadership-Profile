import React, { Component } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { RightPointingIcon } from './Icons'

class List extends Component {
    render() {
        return (
            <div>
                <Table striped className="directory-table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>District</th>
                        <th>School</th>
                        <th>Position</th>
                        <th>Years</th>
                        <th>Degree</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>                    
                                <span class="dot"></span>
                            </td>
                            <td>446235</td>
                            <td>Angel Rivera</td>
                            <td>Mesquite District</td>
                            <td>Mesquite High School</td>
                            <td>Teacher</td>
                            <td>5</td>
                            <td>Ph.D.</td>
                            <td><RightPointingIcon /></td>
                        </tr>
                    </tbody>
                <tfoot>
                <span>Showing 1-10 of 340 Users</span>
                    <Pagination size="sm" aria-label="Page navigation example">
                        <PaginationItem>
                            <PaginationLink previous href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                            1
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                            2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                            3
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink next href="#" />
                        </PaginationItem>
                    </Pagination>
                </tfoot>
                </Table>
                </div>
        );
    }
}

  export default List;