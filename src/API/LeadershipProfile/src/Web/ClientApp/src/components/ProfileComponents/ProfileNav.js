// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { Nav, NavItem, NavLink} from 'reactstrap';

const ProfileNav = (props) => {
    return (
        <Nav>
            <NavItem>
                <NavLink href="#">General Info</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="#">Leader of Self</NavLink>
            </NavItem>
        </Nav>)
}

export default ProfileNav;
