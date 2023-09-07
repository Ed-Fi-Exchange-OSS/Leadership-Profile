import React, { useState, useRef } from 'react';
import { Nav, NavItem, NavLink} from 'reactstrap';

import ProfileInfo from './ProfileInfo';
import ProfessionalDevelopmentTable from './../ProfessionalDevelopmentComponents/ProfessionalDevelopmentTable'
import CertificationsTable from './../CertificationsComponents/CertificationsTable'
import PositionHistoryTable from '../PositionHistoryComponent/PositionHistoryTable';
import UseProfile from './UseProfile';
import ProfileBreadcrumbMenu from './ProfileBreadcrumbMenu';
import EvaluationChart from '../EvaluationChartComponent/EvaluationChart';

const Profile = () => {
    const [activeComponent, setActiveComponent] = useState("general");
    const id = window.location.href.slice(window.location.href.lastIndexOf('/')+1);
    const { data, losMapping } = UseProfile(id);

    const prositionHistory = data.positionHistory
        ?.toSorted((a,b) => a.startDate.localeCompare(b.startDate))
        .reduce((acc, cur) => {
            const prev = acc[acc.length -1];
            if(prev && prev.role === cur.role && prev.schoolName === cur.schoolName){
                prev.endDate = cur.endDate
            }else{
                acc.push({ ...cur });
            }
            return acc;
        }, []).reverse();

    data.startDate = prositionHistory && prositionHistory[0]?.startDate;

    var losMappingResult = null;

    if (data.performanceMeasures != undefined) {
        losMappingResult = losMapping(data.performanceMeasures); 
    }
 
    return (
        <div className="d-flex flex-column container">
            <ProfileBreadcrumbMenu data={data} />
            <ProfileInfo data={data}/>
            <Nav className="profile-nav">
                <NavItem className={activeComponent === "general" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("general")}>General Info</NavLink>
                </NavItem>
                <NavItem className={activeComponent === "leader" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("leader")}>Performance</NavLink>
                </NavItem>
            </Nav>

            {activeComponent === "general" && data !== {} ? (
                <div>
                    <PositionHistoryTable title='Position History' data={prositionHistory} />
                    <CertificationsTable title='Certifications' data={data.certificates} />
                    <ProfessionalDevelopmentTable title='Professional Development and Learning Experiences' data={data.professionalDevelopment}/>
                </div>
                ) : activeComponent === "leader" && data !== {} ? (
                    <div>
                         {
                             data.evaluations.map(evaluation =>{
                                 return(
                                    <div>
                                        <EvaluationChart title={evaluation.title} data={data.evaluations} key={evaluation.title}/>
                                    </div>
                                 )
                             })
                         }
                         
                    </div>
                ) : '' }
        </div >
    );
}

export default Profile;