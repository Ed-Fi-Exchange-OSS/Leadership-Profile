import React, { useState, useRef } from 'react';
import { Nav, NavItem, NavLink} from 'reactstrap';

import ProfileInfo from './ProfileInfo';
import CollapsibleTable from './CollapsibleTable';
import CollapsibleLeaderOfSelf from './CollapsibleLeaderOfSelf';
import LeaderOfOrgChart from './LeaderOfOrgChart';
import ProfessionalDevelopmentTable from './../ProfessionalDevelopmentComponents/ProfessionalDevelopmentTable'
import CertificationsTable from './../CertificationsComponents/CertificationsTable'
import EducationTable from './../EducationComponents/EducationTable';
import PositionHistoryTable from '../PositionHistoryComponent/PositionHistoryTable';
import UseProfile from './UseProfile';

const Profile = () => {
    const [activeComponent, setActiveComponent] = useState("general");
    const id = window.location.href.slice(window.location.href.lastIndexOf('/')+1);
    const { data } = UseProfile(id);

    return (
        <div>
            <ProfileInfo data={data}/>
            <Nav className="profile-nav">
                <NavItem className={activeComponent === "general" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("general")}>General Info</NavLink>
                </NavItem>
                <NavItem className={activeComponent === "leader" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("leader")}>Leader of Self</NavLink>
                </NavItem>
            </Nav>

            {activeComponent === "general" && data !== {} ? (
                <div>
                    <EducationTable title='Education' data={data.education} />
                    <PositionHistoryTable title='Position History' data={data.positionHistory} />
                    <CertificationsTable title='Certifications' data={data.certificates} />
                    <ProfessionalDevelopmentTable title='Professional Development and Learning Experiences' data={data.professionalDevelopment}/>
                </div>
                ) : activeComponent === "leader" && Object.keys(data).length !== 0 ? (
                    <div>
                        {/* { (data.category).map((obj, i) => {
                            return (<CollapsibleLeaderOfSelf title={obj.categoryTitle} data={obj}/>)
                            })
                        } */}
                    </div>
                ) : '' }
        </div >
    );
}

export default Profile;