import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import AuthService from '../utils/auth-service';
import config from '../config';

const Navigation = (props) => {
  const { logoutAuth, isAuthenticated, getAuthInfo } = AuthService();
  const authInfo = getAuthInfo();
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const { API_URL, API_CONFIG } = config();

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    const apiUrl = new URL(API_URL.href + '/account/logout');
    fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        referrerPolicy: 'origin-when-cross-origin',
        body: JSON.stringify({
        'logoutId': authInfo,
    })}).then(() => {
      logoutAuth();
        history.push(new URL(API_URL.href + '/account/login').href);
      history.go(0);
    }).catch(error => console.error(error)); 
  }

  const userRoles = () => {
    history.push('/admin/');
    history.go(0);
  }

  return (
    <div>
      <Navbar expand="md">
        <NavbarBrand href="/">TPDM Leadership Portal</NavbarBrand>
        <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            {isAuthenticated() ? 
            <Nav className="ml-auto">
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                      <span className="dot"></span>
                      {authInfo}
                  </DropdownToggle>
                  <DropdownMenu right>
                      <DropdownItem onClick={() => userRoles()}>
                        User Roles
                      </DropdownItem>
                      <DropdownItem onClick={() => logout()}>
                        Logout
                      </DropdownItem>
                  </DropdownMenu>
                  </UncontrolledDropdown>
              </Nav>
            : 
            <Nav className="ml-auto">
              <NavItem>
                <NavLink href="/account/register/">Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/account/login/">Login</NavLink>
              </NavItem>
            </Nav>}
          </Collapse>
      </Navbar>
    </div>
  );
}

export default Navigation;