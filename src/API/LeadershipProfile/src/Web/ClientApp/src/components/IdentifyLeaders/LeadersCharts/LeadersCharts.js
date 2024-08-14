// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect, useState } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
import { Table } from "reactstrap";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '',
    },
  },
};

const genderLabels = ['F', 'M'];
export const genderData = {
  labels: genderLabels,
  datasets: [
    {
      label: 'EL',
      data: [4, 3],
      backgroundColor: 'rgba(97, 142, 221, 0.5)',
    },
    {
      label: 'MS',
      data: [7, 1],
      backgroundColor: 'rgba(174, 210, 133, 0.5)',
    },
    {
      label: 'HS',
      data: [5, 2],
      backgroundColor: 'rgba(223, 109, 25, 0.5)',
    }
  ],
  // height: '150px'
};
const LeadersCharts = ({roleChartData, raceChartData, genderChartData, totalCount}) => {

  useEffect(() => {
  })


  return (
    <div className="container flex-container">
        <Row>
          {/* <Col md="5">
            <div style={{backgroundColor: 'rgba(237, 234, 238, 1)', padding: "0.5rem"}} className="p-2">
              22 leaders 'ready' for <br></br>
              50 projected vacancies
            </div>
          </Col> */}
          <Col md="12">
            <p>{totalCount} Total Candidates Selected</p>

            <div  style={{height: '250px'}}>
              <Bar options={options} data={roleChartData} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col style={{height: '250px'}}>
            <Bar options={options} data={raceChartData} />
          </Col>
        </Row>
        <Row>
          <Col style={{height: '250px'}}>
            <Bar options={options} data={genderChartData} />
          </Col>
        </Row>
    </div>
  );
};

export default LeadersCharts;
