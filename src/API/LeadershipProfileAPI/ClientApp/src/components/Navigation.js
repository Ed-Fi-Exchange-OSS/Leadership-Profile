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
  Tooltip,
} from 'reactstrap';

import { HeaderLogo } from './images'
import AuthService from '../utils/auth-service';
import IngestDateService from '../utils/ingest-date-service';
import LogoutService from '../utils/logout-service';
import config from '../config';

const Navigation = (props) => {
  const { isAuthenticated, getAuthInfo } = AuthService();
  const { logout } = LogoutService();
  const authInfo = getAuthInfo();
  const [isOpen, setIsOpen] = useState(false);
  const {SCHOOL_HEADER} = config();

  const toggle = () => setIsOpen(!isOpen);

  const { getLastIngestionDate } = IngestDateService();
  const lastIngestionDate = getLastIngestionDate();
 
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const [tooltipOpenCount, setTooltipOpenCount] = useState(false);
  const toggleTooltipCount = () => setTooltipOpenCount(!tooltipOpenCount);
  const [tooltipOpenDate, setTooltipOpenDate] = useState(false);
  const toggleTooltipDate = () => setTooltipOpenDate(!tooltipOpenDate);
  
  return (
    <div>
      <Navbar expand="md">
          <NavbarBrand href="/"><HeaderLogo/> {SCHOOL_HEADER}</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <span className="ml-auto badge badge-pill badge-success pl-4 pr-4">
              <span id="refreshPill">
                { lastIngestionDate.ItemsProccessed.toLocaleString(undefined, {maximumFractionDigits: 0}) } records<br />
                { Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(lastIngestionDate.Date) }
                <Tooltip target="refreshPill" isOpen={tooltipOpen} toggle={toggleTooltip}> The data was refreshed </Tooltip>
              </span>
            </span>
            <span className="badge badge-pill badge-success m-2">
              <span id="refreshCountPill">{ lastIngestionDate.ItemsProccessed.toLocaleString(undefined, {maximumFractionDigits: 0}) } records<br /></span>
              <Tooltip target="refreshCountPill" isOpen={tooltipOpenCount} toggle={toggleTooltipCount}> Records refreshed </Tooltip>
            </span>
           
            <span className="badge badge-pill badge-success m-2">
              <span id='refreshDatePill'>{ Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(lastIngestionDate.Date) }</span>
              <Tooltip target="refreshDatePill" isOpen={tooltipOpenDate} toggle={toggleTooltipDate}> The data was refreshed as of </Tooltip>
            </span>


            {isAuthenticated() ?
            <Nav>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                      <span className="dot"></span>
                      {authInfo}
                  </DropdownToggle>
                  <DropdownMenu right>
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