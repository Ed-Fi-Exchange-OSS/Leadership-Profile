// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";

const StaffTable = ({data, selectedSchool}) => {

    return (
<Table borderless>
<thead>
  <tr>
    <th>#</th>
    <th>Name</th>
    <th>School</th>
    <th>Level</th>
    <th>Vacancy Cause</th>
    <th>Departure Date</th>
    <th>Gender</th>
    <th>Race</th>
  </tr>
</thead>
<tbody>
  {data
    //.filter((d) => d.schoolYear == getYear(selectedVacancyYear) && ([d.schoolLevel, '[ALL]'].includes(getSchoolLevel(selectedSchoolLevel))))
    .map((element, i) => (
      <tr key={"year-table-record-" + i}>
        <th scope="row">{i + 1}</th>
        <td>
          <Link to={`/profile/${element.staffUniqueId}`} target="_blank" >
            {element.fullNameAnnon}
          </Link>
        </td>
        <td>{element.schoolNameAnnon}</td>
        <td>{element.schoolLevel}</td>
        <td>{element.vacancyCause}</td>
        <td>{element.schoolYear}</td>
        <td>{element.gender}</td>
        <td>{element.race}</td>
        <td></td>
      </tr>
    ))}
</tbody>
</Table>
    )
}

export default StaffTable;
