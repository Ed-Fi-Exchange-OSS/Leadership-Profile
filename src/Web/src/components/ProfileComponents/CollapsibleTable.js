import React, { useState, useEffect } from 'react';
import { CardTitle, Collapse, Table } from 'reactstrap';
import { EducationIcon, BriefcaseIcon, ChartIcon, CertificateIcon, DownPointingIcon } from '../Icons';
import { formatDate } from '../../utils/date';

const educationCategories = { 'institution': 'Institution', 'degree': 'Degree', 'graduationDate': 'Date', 'specialization': 'Specialization' };
const positionHistoryCategories = { 'role': 'Role', 'schoolName': 'School', 'startDate': 'Start Date', 'endDate': 'End Date' };
const certificateCategories = { 'description': 'Description', 'type': 'Type', 'validFromDate': 'Valid from', 'validToDate': 'Valid to' };
const professionalDevelopmentCategories = { 'courseName': 'Course name', 'date': 'Date', 'location': 'Location', 'alignmentToLeadership': 'Alignment to leadership definition' };

const CollapsibleTable = (props) => {
    const { title, data } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [icon, setIcon] = useState('');
    const [categories, setCategories] = useState({});

    const toggle = () => setIsOpen(!isOpen);

    function setTable(title) {
        switch (title) {
            case "Education":
                setIcon(<EducationIcon />);
                setCategories(educationCategories);
                break;
            case "Position History":
                setIcon(<BriefcaseIcon />);
                setCategories(positionHistoryCategories);
                break;
            case "Certifications":
                setIcon(<CertificateIcon />);
                setCategories(certificateCategories);
                break;
            case "Professional Development and Learning Experiences":
                setIcon(<ChartIcon />);
                setCategories(professionalDevelopmentCategories);
                break;
            default:
                setIcon('');
        }
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
                        {data !== undefined ? data.map(row =>
                        (<tr className="profile-table-body-row">
                            {Object.keys(categories).map(value => {
                                let displayValue = row[`${value}`];
                                displayValue = (value.toLowerCase()).includes('date') ? formatDate(displayValue) : displayValue;
                                return (<td>{displayValue}</td>)
                            })}
                        </tr>)) : ''
                        }
                    </tbody>
                </Table>
            </Collapse>
        </div>
    );
}

export default CollapsibleTable;