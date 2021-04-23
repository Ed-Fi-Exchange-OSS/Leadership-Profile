import React from 'react';
import { MailIcon, PhoneIcon, PersonIcon, GeoIcon, RightPointingIcon } from '../../Icons';
import { Link } from 'react-router-dom';
import { DefaultProfile } from '../../images'
const CardProfile = (props) => {

    const {data} = props;

    return(
        <div className="card-grid">
            <div className="card-profile">
                <DefaultProfile></DefaultProfile>
            </div>
            <div className="card-link">
                <Link to={`profile/${data.staffUniqueId}`}><RightPointingIcon /></Link>
            </div>
            <div className="card-contact">
                <h4 className="card-content">{data.fullName}</h4>
                <div className="card-content"><MailIcon />{data.email}</div>
                <div className="card-content"><PhoneIcon />{data.telePhone}</div>
            </div>
            <div className="card-seperator divider">
            </div>
            <div className="card-person">
                <div className="card-content"><PersonIcon />{data.highestDegree}</div>
            </div>
            <div className="card-geo">
                <div className="card-content"><GeoIcon />{data.location}</div>
            </div>
        </div>
    )
}

export default CardProfile;