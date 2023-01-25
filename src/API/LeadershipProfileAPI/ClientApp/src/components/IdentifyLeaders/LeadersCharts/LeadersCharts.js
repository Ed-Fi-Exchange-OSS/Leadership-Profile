import React, { useState } from "react";

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

const rolesLabels = ['EL', 'MS', 'HS'];

export const roleData = {
  labels: rolesLabels,
  datasets: [
    {
      label: '',
      data: [7, 8, 7],
      backgroundColor: 'rgba(97, 142, 221, 0.5)',
    }
  ],
};

const raceLabels = ['Asian', 'Black', 'Hispanic', 'Two or more races', 'White'];
export const raceData = {
  labels: raceLabels,
  datasets: [
    {
      label: 'EL',
      data: [1, 0, 1, 1, 4],
      backgroundColor: 'rgba(97, 142, 221, 0.5)',
    },
    {
      label: 'MS',
      data: [0, 0, 2, 3, 3],
      backgroundColor: 'rgba(174, 210, 133, 0.5)',
    },
    {
      label: 'HS',
      data: [0, 1, 1, 1, 4],
      backgroundColor: 'rgba(223, 109, 25, 0.5)',
    }
  ],
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

const LeadersCharts = () => {

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
            {/* <p>Total Assistant Principals Selected</p>            
            <p> 22 Total in Role Selected</p> */}

            <div  style={{height: '150px'}}>
              <Bar options={options} data={roleData} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col style={{height: '180px'}}>
            <Bar options={options} data={raceData} />            
          </Col>          
        </Row>
        <Row>
          <Col style={{height: '180px'}}>
            <Bar options={options} data={genderData} />            
          </Col>          
        </Row>
    </div>
  );
};

export default LeadersCharts;
