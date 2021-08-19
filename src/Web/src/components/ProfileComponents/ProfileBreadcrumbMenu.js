import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom'; 

const ProfileBreadcrumbMenu = (props) => {

    const { data } = props;
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem><Link to={'../directory'}>Directory</Link></BreadcrumbItem>
        <BreadcrumbItem active>{ data.fullName }</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export default ProfileBreadcrumbMenu;