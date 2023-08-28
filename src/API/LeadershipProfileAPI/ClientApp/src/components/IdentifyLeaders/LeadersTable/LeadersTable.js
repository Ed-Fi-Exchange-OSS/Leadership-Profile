import React, { useState } from "react";
import { useEffect, useRef } from "react";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


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

import { useDownloadExcel } from 'react-export-table-to-excel';

const LeadersTable = ({ data }) => {

  const exportAsExcel = () => {
    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    };
  };

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Users table',
    sheet: 'Users'
})
 
  return (
    <div className="container flex-container">
      <table ref={tableRef} className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>School Level</th>
            <th>School name</th>
            <th>Role</th>
            <th>Full Name</th>
            <th>Tot Yrs Exp</th>
            <th>Average T-PESS Score</th>
            <th>Domain 1</th>
            <th>Domain 2</th>
            <th>Domain 3</th>
            <th>Domain 4</th>
            <th>Domain 5</th>
            <th>Gender</th>
            <th>Race/Ethnicity</th>
          </tr>
        </thead>
        <tbody>
          {data
            ? data.map((staff, i) => (
                <tr key={'leader-record-' + i}>
                  <th scope="row">{i + 1}</th>
                  <td>{staff.schoolLevel}</td>
                  <td>{staff.schoolNameAnnon}</td>
                  <td>{staff.positionTitle}</td>
                  <td>
                    {/* <Link to={`profile/${207221}`} target="_blank"> */}
                    {/* <Link to={`profile/${207221}`}>{staff.fullNameAnnon}</Link> */}
                    <Link to={`profile/${staff.staffUniqueId}`} target="_blank">{staff.fullNameAnnon}</Link>
                  </td>
                  <td>{staff.totYrsExp}</td>
                  {/* <td>{(staff.domain1 + staff.domain2 + staff.domain3 + staff.domain4 + staff.domain5)/5}</td> */}
                  <td>{staff.overallScore.toFixed(2)}</td>
                  <td>{staff.domain1}</td>
                  <td>{staff.domain2}</td>
                  <td>{staff.domain3}</td>
                  <td>{staff.domain4}</td>
                  <td>{staff.domain5}</td>
                  <td>{staff.gender}</td>
                  <td>{staff.race}</td>
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
              <a href="#"> View All </a>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            {/* <a href="#" onClick={exportAsExcel} > Download </a> */}
          </tr>            
        </tbody>
      </table>
      <a href="#" onClick={onDownload} > Download </a>
    </div>
  );
};

export default LeadersTable;
