import React, { useState } from 'react';
import { Collapse, Table } from 'reactstrap';

const CollapsibleTable = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <h2 onClick={toggle}>Education</h2>
            <Collapse isOpen={isOpen}>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Institution</th>
                            <th>Degree</th>
                            <th>Date</th>
                            <th>Specialization</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>University of North Texas</th>
                            <td>Doctorate</td>
                            <td>2004</td>
                            <td>Education Administration</td>
                        </tr>
                    </tbody>
                </Table>
            </Collapse>
        </div>
    );
}

export default CollapsibleTable;