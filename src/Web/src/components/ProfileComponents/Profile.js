import React, { useState, useRef } from 'react';
import { Nav, NavItem, NavLink} from 'reactstrap';

import ProfileInfo from './ProfileInfo';
import CollapsibleTable from './CollapsibleTable';
import LeaderOfOrgChart from './LeaderOfOrgChart';
import CertificationsTable from './../CertificationsComponents/CertificationsTable'
import UseProfile from './UseProfile';

const Profile = () => {
    const [activeComponent, setActiveComponent] = useState("general");
    const id = window.location.href.slice(window.location.href.lastIndexOf('/')+1);
    const { data } = UseProfile(id);
    
    return (
        <div>
            <ProfileInfo data={data} />
            <Nav className="profile-nav">
                <NavItem className={activeComponent === "general" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("general")}>General Info</NavLink>
                </NavItem>
                <NavItem className={activeComponent === "leader" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("leader")}>Leader of Org</NavLink>
                </NavItem>
            </Nav>

            { activeComponent === "general" && data !== {} ? (
                <div>
                    <CollapsibleTable title='Education' data={data.education} />
                    <CollapsibleTable title='Position History' data={data.positionHistory} />
                    <CertificationsTable title='Certifications' data={data.certificates} />
                    <CollapsibleTable title='Professional Development and Learning Experiences' data={data.professionalDevelopment}/>
                </div>
                ) : activeComponent === "leader" ? (
                    <LeaderOfOrgChart />
                ) : '' }
        </div >
    );
}

export default Profile;