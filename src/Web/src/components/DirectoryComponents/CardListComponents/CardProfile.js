import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Link } from 'react-router-dom';
import { DefaultProfile } from '../../images'
const CardProfile = (props) => {

    const {data} = props;

    return(
        <div class="card-grid">
            <div class="card-profile">
                <DefaultProfile></DefaultProfile>
            </div>
            <div class="card-link">
                <Link to={`profile/${data.staffUniqueId}`}><RightPointingIcon /></Link>
            </div>
            <div class="card-contact">
                <h4 class="card-content">{data.fullName}</h4>
                <div class="card-content"><MailIcon />{data.email}</div>
                <div class="card-content"><PhoneIcon />{data.telePhone}</div>
            </div>
            <div class="card-seperator divider">
            </div>
            <div class="card-person">
                <div class="card-content"><PersonIcon />{data.highestDegree}</div>
            </div>
            <div class="card-geo">
                <div class="card-content"><GeoIcon />{data.location}</div>
            </div>
        </div>
    )
}

export default CardProfile;