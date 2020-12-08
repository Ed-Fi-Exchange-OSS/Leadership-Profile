import React, { useState } from 'react';
import { Nav, NavItem, NavLink} from 'reactstrap';

import ProfileInfo from './ProfileComponents/ProfileInfo';
import CollapsibleTable from './ProfileComponents/CollapsibleTable';
import LeaderOfOrgChart from './ProfileComponents/LeaderOfOrgChart';

const Profile = () => {
    const [activeComponent, setActiveComponent] = useState("general");

    return (
        <div>
            <ProfileInfo />

            <Nav className="profile-nav">
                <NavItem className={activeComponent === "general" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("general")}>General Info</NavLink>
                </NavItem>
                <NavItem className={activeComponent === "leader" ? "current-profile-page nav-option" : "nav-option"}>
                    <NavLink onClick={() => setActiveComponent("leader")}>Leader of Org</NavLink>
                </NavItem>
            </Nav>

            { activeComponent === "general" ? (
                <div>
                    <CollapsibleTable title='Education' categories={['Institution', 'Degree', 'Date', 'Specialization']} />
                    <CollapsibleTable title='Position History' categories={['Role', 'School', 'Start Date', 'End Date']} />
                    <CollapsibleTable title='Certifications' categories={['Description', 'Tyoe', 'Valid from', 'Valid to']} />
                    <CollapsibleTable title='Professional Development and Learning Experiences' categories={['Course name', 'Date', 'Location', 'Alignment to leadership definition']} />
                </div>
                ) : activeComponent === "leader" ? (
                    <LeaderOfOrgChart />
                ) : '' }
        </div >
    );
}

export default Profile;
