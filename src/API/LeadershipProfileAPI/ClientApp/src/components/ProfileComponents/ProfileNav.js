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