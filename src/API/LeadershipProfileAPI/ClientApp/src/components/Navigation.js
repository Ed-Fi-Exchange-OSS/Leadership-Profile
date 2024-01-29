// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useState } from 'react';
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
  UncontrolledTooltip,
} from "reactstrap";

import { HeaderLogo } from "./images";
import AuthService from "../utils/auth-service";
import IngestDateService from "../utils/ingest-date-service";
import LogoutService from "../utils/logout-service";
import config from "../config";

const Navigation = (props) => {
  const { isAuthenticated, getAuthInfo } = AuthService();
  const { logout } = LogoutService();
  const authInfo = getAuthInfo();
  const [isOpen, setIsOpen] = useState(false);
  const { SCHOOL_HEADER } = config();

  const toggle = () => setIsOpen(!isOpen);

  const { getLastIngestionDate } = IngestDateService();
  const lastIngestionDate = getLastIngestionDate();

  return (
    <div>
      <Navbar expand="md">
        <NavbarBrand href="/">
          <HeaderLogo /> {SCHOOL_HEADER}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>          
          <span
            id="refreshPill"
            className="ml-auto badge badge-pill badge-blue px-4"
          >
            {lastIngestionDate.ItemsProccessed.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            records
            <br />
            <div className="pt-1">
              on {Intl.DateTimeFormat(undefined).format(lastIngestionDate.Date)}
            </div>
          </span>
          <UncontrolledTooltip target="refreshPill">
            {" "}
            Last data refresh date
          </UncontrolledTooltip>

          {isAuthenticated() ? (
            <Nav>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <span className="dot"></span>
                  {authInfo}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          ) : (
            <Nav className="">
              <NavItem>
                <NavLink href="/account/register/">Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/account/login/">Login</NavLink>
              </NavItem>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
