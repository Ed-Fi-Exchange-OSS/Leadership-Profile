import React, { useState } from 'react';
import { Collapse, Table } from 'reactstrap';
import { EducationIcon, RibbonIcon, DownPointingIcon } from '../Icons';

function getIcon(title) {
    switch (title) {
        case "Education":
            return <EducationIcon />;
        case "Position History":
            return <ion-icon name="briefcase"></ion-icon>;
        case "Certifications":
            return <RibbonIcon />;
        case "Professional Development and Learning Experiences":
            return <ion-icon name="bar-chart"></ion-icon>;
    }

}


const CollapsibleTable = (props) => {
    const { title, categories } = props;
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="profile-collapsible-container">
            <h2 className="profile-collapsible-header" onClick={toggle}>
                <span className="profile-collapsible-icon">{getIcon(title)}</span>
                <span>{title}</span>
                <span className="profile-collapsible-down-icon"><DownPointingIcon /></span>
            </h2>
            <Collapse isOpen={isOpen}>
                <Table striped className="profile-collapsible-table">
                    <thead className="profile-table-head">
                        <tr className="profile-table-header-row">
                            {categories.map(category => (<th>{category}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="profile-table-body-row">
                            <td>University of North Texas</td>
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
