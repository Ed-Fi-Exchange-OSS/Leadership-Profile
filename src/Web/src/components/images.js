import React from 'react';

const DefaultProfile = () => 
    <img width="50px" height="50px" alt="profile" alt="default profile" className="rounded-circle"
    src={process.env.PUBLIC_URL + "/images/generic-profile.png"} />

export{
    DefaultProfile
};