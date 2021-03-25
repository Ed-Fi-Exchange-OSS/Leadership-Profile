import React, { useState, useEffect } from 'react';
import { CardTitle, Collapse, Table } from 'reactstrap';
import { ChartIcon, DownPointingIcon } from '../Icons';

const professionalDevelopmentCategories = { 'professionalDevelopmentTitle': 'Course name', 'attendanceDate': 'Date', 'location': 'Location', 'alignmentToLeadership': 'Alignment to leadership definition' };

const ProfessionalDevelopmentTable = (props) => {
    const { title, data } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [icon, setIcon] = useState('');
    const [categories, setCategories] = useState({});

    const toggle = () => setIsOpen(!isOpen);

    function setTable(title) {
        setIcon(<ChartIcon />);
        setCategories(professionalDevelopmentCategories);
    }

    useEffect(() => {
        setTable(title);
    }, [CardTitle]);

    return (
        <div className="profile-collapsible-container">
            <h2 className="profile-collapsible-header" onClick={toggle}>
                <span className="profile-collapsible-icon">{icon}</span>
                <span>{title}</span>
                <span className="profile-collapsible-down-icon"><DownPointingIcon /></span>
            </h2>
            <Collapse isOpen={isOpen}>
                <Table striped className="profile-collapsible-table">
                    <thead className="profile-table-head">
                        <tr className="profile-table-header-row">
                            {Object.values(categories).map(category => (<th key={category}>{category}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {data !== undefined ? data.map((row, i) =>
                        (<tr key={i} className="profile-table-body-row">
                            {Object.keys(categories).map((value, i) => {
                                let displayValue = row[`${value}`];
                                displayValue = (value.toLowerCase()).includes('date') ? formatDate(displayValue) : displayValue;
                                return (<td key={i}>{displayValue}</td>)
                            })}
                        </tr>)) : ''
                        }
                    </tbody>
                </Table>
            </Collapse>
        </div>
    );
}

function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString("en-US");
};

export default ProfessionalDevelopmentTable;