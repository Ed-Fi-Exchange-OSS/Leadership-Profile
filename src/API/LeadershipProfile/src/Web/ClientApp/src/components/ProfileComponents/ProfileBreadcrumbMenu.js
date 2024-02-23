// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
