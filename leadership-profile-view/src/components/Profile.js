import React, { Component } from 'react';
import ProfileInfo from './ProfileComponents/ProfileInfo';
import ProfileNav from './ProfileComponents/ProfileNav';
import CollapsibleTable from './ProfileComponents/CollapsibleTable';
import LeaderOfOrgChart from './ProfileComponents/LeaderOfOrgChart';

class Profile extends Component {
    render() {
        return (
            <div>
                <ProfileInfo />
                <ProfileNav />
                <CollapsibleTable />
                <LeaderOfOrgChart />
            </div >
        );
    }
}

export default Profile;