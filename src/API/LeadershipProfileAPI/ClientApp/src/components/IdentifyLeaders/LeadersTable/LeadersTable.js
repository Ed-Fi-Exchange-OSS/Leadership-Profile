import React, { useState } from "react";
import { useEffect, useRef } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
} from "reactstrap";

import { Button } from "reactstrap";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import { Link } from "react-router-dom";

import config from "../../../config";

import UseLeadersTable from "./UseLeadersTable";

const LeadersTable = ({ data }) => {
 
  return (
    <div className="container flex-container">
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>School Level</th>
            <th>School name</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Race/Ethnicity</th>
            <th>Tot Yrs Exp</th>
            <th>Average T-PESS Score</th>
            <th>Domain 1: Strong School Leadership and Planning</th>
            <th>Domain 2: Effective Well-Supported Teachers</th>
            <th>Domain 3: Positive School Culture</th>
            <th>Domain 4: High Quality Curriculum</th>
            <th>Domain 5: Effective Instruction</th>
          </tr>
        </thead>
        <tbody>
          {data
            ? data.map((staff, i) => (
                <tr key={'leader-record-' + i}>
                  <th scope="row">{i + 1}</th>
                  <td>{staff.schoolLevel}</td>
                  <td>{staff.schoolNameAnnon}</td>
                  <td>
                    {/* <Link to={`profile/${207221}`} target="_blank"> */}
                    <Link to={`profile/${207221}`}>{staff.fullNameAnnon}</Link>
                  </td>
                  <td>{staff.gender}</td>
                  <td>{staff.race}</td>
                  <td>{staff.totYrsExp}</td>
                  <td>{(staff.domain1 + staff.domain2 + staff.domain3 + staff.domain4 + staff.domain5)/5}</td>
                  <td>{staff.domain1}</td>
                  <td>{staff.domain2}</td>
                  <td>{staff.domain3}</td>
                  <td>{staff.domain4}</td>
                  <td>{staff.domain5}</td>
                  {/* {staff.domainsScore ? staff.domainsScore.map(score => (

            <td>{score}</td>
          )) : ""} */}
                </tr>
              ))
            : ""}

          <tr>
            <th scope="row"></th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <a href="#"> View All</a>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default LeadersTable;
