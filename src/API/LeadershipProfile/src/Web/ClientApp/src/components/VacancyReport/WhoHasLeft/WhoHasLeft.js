// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useState } from "react";
import { Col, Row, Card, CardBody, Button } from "reactstrap";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import StaffTable from "../../StaffTable";
import UseWhoHasLeft from "./UseWhoHasLeft";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const pieChartOptions = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          return tooltipItem.yLabel;
        },
      },
    },
    title: {
      display: false,
      text: "Vacancy Causes",
    },
  },
  maintainAspectRatio: false,
};
export const raceOptions = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Race/Ethnicity",
    },
  },
  maintainAspectRatio: false,
};
export const genderOptions = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Gender",
    },
  },
  maintainAspectRatio: false,
};

const WhoHasLeft = ({data, selectedRole}) => {

  const {
    pieChartData,
    raceChartData,
    genderChartData,
    mainNumber,
    mainReason
  } = UseWhoHasLeft(data) ?? {};

  const [causeFilter, setCauseFilter] = useState(null);

  const pieChartOptionsWithOnClick = {
    ... pieChartOptions,
    onClick: function (evt, elements) {
      setCauseFilter(pieChartData.labels[elements[0].index]);
    },
  };

  return (
    <React.Fragment>
    <Row className="my-4">
      <Col md="6">
        <h5 className="left-title">
          {/* <span className="orange-bold-text mr-1"> { data && data.role == "Principal" ? '47' : 'AP'  } </span> */}
          {/* <span className="orange-bold-text mr-1"> { pieChartData && pieChartData.datasets && pieChartData.datasets.length ? '47' : 'AP'  } </span> */}
          {mainNumber} of {selectedRole} vacancies Caused by {mainReason}
          {/* <span className="orange-bold-text mr-1"> { data && data.role == "Principal" ? 'Internal Transfer' : 'AP'  } </span> */}
        </h5>
        <Row>
          <Col md="5"  className="p-2">
            <Row className="my-1">
              <Col md="3">
                <div className="orange cause-square"></div>
              </Col>
              <Col md="9" style={{cursor: 'pointer'}} onClick={() => setCauseFilter('Attrition')}>{pieChartData && pieChartData.datasets && pieChartData.datasets.length ? pieChartData.datasets[0].data[0] : 0} Attrition</Col>
            </Row>
            <Row className="my-1">
              <Col md="3">
                <div className="brown cause-square"></div>
              </Col>
              <Col md="9" style={{cursor: 'pointer'}} onClick={() => setCauseFilter('Retirement')}>{pieChartData && pieChartData.datasets && pieChartData.datasets.length ? pieChartData.datasets[0].data[1] : 0} Retirement</Col>
            </Row>
            <Row className="my-1">
              <Col md="3">
                <div className="pink cause-square"></div>
              </Col>
              <Col md="9" style={{cursor: 'pointer'}} onClick={() => setCauseFilter('Internal Transfer')}>{pieChartData && pieChartData.datasets && pieChartData.datasets.length ? pieChartData.datasets[0].data[2] : 0} Internal Transfer</Col>
            </Row>
            <Row className="my-1">
              <Col md="3">
                <div className="green cause-square"></div>
              </Col>
              <Col md="9" style={{cursor: 'pointer'}} onClick={() => setCauseFilter('Internal Promotion')}>{pieChartData && pieChartData.datasets && pieChartData.datasets.length ? pieChartData.datasets[0].data[3] : 0} Internal Promotion</Col>
            </Row>
            <Row className="my-1">
              <Col md="3">
                <div className="cause-square"></div>
              </Col>
              <Col md="9">{pieChartData && pieChartData.datasets && pieChartData.datasets.length ? pieChartData.datasets[0].data[4] : 0} Not Available</Col>
            </Row>
          </Col>
          <Col md="7" className="p-2">
            <Row style={{ height: "285px" }}>
              {pieChartData && (
                <Pie options={pieChartOptionsWithOnClick} data={pieChartData} />
               )}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col md="6">
        <h4 className="fw-bold">Who has left over the past 5 years?</h4>
        <Row>
          <Col style={{ height: "285px" }}>
            {raceChartData && (
              <Bar options={raceOptions} data={raceChartData} />
            )}
          </Col>
          {/* <Col md="6" style={{ height: "285px" }}>
            {genderChartData && (
              <Bar options={genderOptions} data={genderChartData} />
            )}
          </Col> */}
        </Row>
      </Col>
      <Col></Col>
    </Row>
    {causeFilter != null ? (
      <Row>
        <Card className="w-100 mb-4">
          <CardBody>
            <Button
              close
              size="lg"
              className="mx-3"
              onClick={() => setCauseFilter(null)}
            />

          <StaffTable data={data.filter((d) => d.vacancyCause === causeFilter)} />

          </CardBody>
        </Card>
      </Row>
    ) : (
      ""
    )}
    </React.Fragment>
  );
};

export default WhoHasLeft;
