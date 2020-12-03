import React, { Component } from 'react';
import ProfileInfo from './ProfileComponents/ProfileInfo';
import ProfileNav from './ProfileComponents/ProfileNav';
import CollapsibleTable from './ProfileComponents/CollapsibleTable';
import LeaderOfOrgChart from './ProfileComponents/LeaderOfOrgChart';
import { EducationIcon } from './Icons'

class Profile extends Component {
    render() {
        return (
            <div>
                <ProfileInfo />
                <ProfileNav />
                <CollapsibleTable title='Education' categories={['Institution', 'Degree', 'Date', 'Specialization']} icon={EducationIcon} />
                <CollapsibleTable title='Position History' categories={['Role', 'School', 'Start Date', 'End Date']} />
                <CollapsibleTable title='Certifications' categories={['Description', 'Tyoe', 'Valid from', 'Valid to']} />
                <CollapsibleTable title='Professional Development and Learning Experiences' categories={['Course name', 'Date', 'Location', 'Alignment to leadership definition']} />
                {/* <LeaderOfOrgChart /> */}
            </div >
        );
    }
}

export default Profile;