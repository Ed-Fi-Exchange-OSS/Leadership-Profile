// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
    
    const lastPositionEntry = data.positionHistory?.[0];
    const reducedPositionHistory = data.positionHistory
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

    data.yearsInLastRole = yearsInLastRole();

    var losMappingResult = null;

    if (data.performanceMeasures != undefined) {
        losMappingResult = losMapping(data.performanceMeasures);
    }

    function yearsInLastRole() {
        const year0 = (new Date(0)).getFullYear();
        const lastPositionFirstDate = reducedPositionHistory && new Date(reducedPositionHistory?.[0]?.startDate);
        const lastPositionEntryDate = lastPositionEntry && new Date(Date.parse(lastPositionEntry?.startDate));
        const yearEndDate = lastPositionEntryDate && new Date(lastPositionEntryDate.getFullYear() + (lastPositionEntryDate.getMonth() >= 6 ? 1 : 0), 6, 1);
        const lastUpdate = lastPositionEntry?.endDate ??
            (yearEndDate < new Date()
                ? yearEndDate
                : new Date());
        const yearsInLastRole = lastPositionFirstDate && (new Date(lastUpdate - lastPositionFirstDate).getFullYear() - year0);
        return yearsInLastRole ?? 'N/A';
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
                <NavItem className={activeComponent === "rating" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("rating")}>Readiness</NavLink>
                </NavItem>
            </Nav>

            {activeComponent === "general" && data !== {} ? (
                <div>
                    <PositionHistoryTable title='Position History' data={reducedPositionHistory} />
                    <CertificationsTable title='Certifications' data={data.certificates} />
                    <ProfessionalDevelopmentTable title='Professional Development and Learning Experiences' data={data.professionalDevelopment}/>
                </div>
                ) : activeComponent === "leader" && data !== {} ? (
                    <div>
                         {
                             data.evaluations.map(evaluation =>{
                                 return(
                                    <div>
                                        <EvaluationChart title={evaluation.title} data={data.evaluations} key={'0-' + evaluation.title}/>
                                    </div>
                                 )
                             })
                         }

                    </div>
                ) : activeComponent === "rating" && data !== {} ? (
                    <div>
                         {
                             data.rating.map(evaluation =>{
                                 return(
                                    <div>
                                        <EvaluationChart title={evaluation.title} data={data.ratings} key={'1-' + evaluation.title}/>
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
