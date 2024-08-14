// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

import { useDownloadExcel } from "react-export-table-to-excel";

const LeadersTable = ({ data, onViewAll }) => {
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Leaders",
    sheet: "Leaders",
  });

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
                <tr key={"leader-record-" + i}>
                  <th scope="row">{i + 1}</th>
                  <td>{staff.schoolLevel}</td>
                  <td>{staff.nameOfInstitution}</td>
                  <td>{staff.job}</td>
                  <td>
                    <Link
                      to={`/profile/${staff.staffUniqueId}`}
                      target="_blank"
                    >
                      {staff.fullName}
                    </Link>
                  </td>
                  <td>{parseInt(staff.totalYearsOfExperience)}</td>
                  <td>{(staff.overallScore ?? 0).toFixed(2)}</td>
                  <td>{Math.round(staff.domain1)}</td>
                  <td>{Math.round(staff.domain2)}</td>
                  <td>{Math.round(staff.domain3)}</td>
                  <td>{Math.round(staff.domain4)}</td>
                  <td>{Math.round(staff.domain5)}</td>
                  <td>{staff.gender}</td>
                  <td>{staff.race}</td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
      <div className="d-flex justify-content-around">
        {/* <a href="#" onClick={onDownload}>
          {" "}
          Download{" "}
        </a> */}
        <button className="btn btn-outline-primary" onClick={onViewAll}>View All</button>
        <button className="btn btn-outline-primary" onClick={onDownload}>Download</button>
      </div>
    </div>
  );
};

export default LeadersTable;
