// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useState, useEffect } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { Button } from "reactstrap";
import {
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";

import { TableViewIcon, CardViewIcon } from "../Icons";
import BreadcrumbList from "../Breadcrumb";

import LeadersTable from "./LeadersTable/LeadersTable.js";
import LeadersFilters from "./LeadersFilters/LeadersFilters";
import LeadersCharts from "./LeadersCharts/LeadersCharts";
import UseIdentifyLeaders from "./UseIdentifyLeaders";

const IdentifyLeaders = () => {
  const { 
    data, 
    totalCount,
    isDataLoaded,
    fetchData,
    roleChartData,
    raceChartData,
    genderChartData,
  } = UseIdentifyLeaders();
  let [isLoaded, setIsLoaded] = useState(false);
  const [viewAll, setViewAll] = useState(false);


  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const onFiltersValueChangeHandler = (filters) => {
    if (!isLoaded) return;
    fetchData(filters);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPipeLine, setSelectedPipeLine] = useState("Principal");
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handlePipelineSelection = (role) => {
    if (role != selectedPipeLine) {
      // fetchData(role);
      var dataForRole = role == 'Principal' ? {
        roles: [2],
        schoolLevels: [1, 2, 3],
        highestDegrees: [1, 2, 3],
        hasCertification: [1, 2],
        overallScore: [1, 2, 3, 4, 5]
      } : {
        roles: [3,4],
        schoolLevels: [1, 2, 3],
        highestDegrees: [1, 2, 3],
        hasCertification: [1, 2],
        overallScore: [1, 2, 3, 4, 5]
      };
      fetchData(dataForRole);
      setSelectedPipeLine(role);
    }
  };

  const viewAllHandler = (e) => {
    e.preventDefault();
    setViewAll(!viewAll);
  }

  return (
    <div className="container flex-container">
      <div className="row my-4">
        <div className="col-md-4">
          <Link to={"/vacancy-report"}  className="text-decoration-none">
            <Button
              outline
              color="default"
              className="gray-border bold-text w-100 d-flex justify-content-center"
            >
              <h5 className="pt-1">Forecast Vacancy</h5>
            </Button>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to={"/identify-leaders"}  className="text-decoration-none">
            <Button
              outline
              color="default"
              className="yellow-border bold-text  w-100 d-flex justify-content-center"
            >
              <h5 className="pt-1">Identify Leaders</h5>
            </Button>
          </Link>
        </div>
{/* 
        <div className="col-md-3">
          <Button
            outline
            color="default"
            className="gray-border bold-text w-100 d-flex justify-content-center"
          >
            <h5 className="pt-1">Develop Leaders</h5>
          </Button>
        </div> */}
        <div className="col-md-4">
          <Link to="/directory?page=1&sortBy=asc&sortField=id"  className="text-decoration-none">
            <Button
              outline
              color="default"
              className="gray-border bold-text  w-100 d-flex justify-content-center"
            >
              <h5 className="pt-1">Select Leaders</h5>
            </Button>
          </Link>
        </div>
      </div>
      <Row>
        <Col md="6">
        { 
          isDataLoaded != [] ? 
            <LeadersCharts 
              roleChartData={roleChartData}
              raceChartData={raceChartData}
              genderChartData={genderChartData}
              totalCount={totalCount}
            ></LeadersCharts>
            : 
            ""  
        }
          
        </Col>
        {/* <Col md="6" className="p-3" style={{backgroundColor: 'ligthgray'}}> */}
        <Col md="6" className="p-3">
          <Row>
            <Col md="4">
              {/* <div className="col-md-2  d-flex justify-content-end"> */}
              <h3 className="fw-bold text-center">Pipeline</h3>
              {/* </div>     */}
            </Col>
            <Col md="8">
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggle}
                className="ml-1 w-100"
              >
                <DropdownToggle caret color="primary" className="w-100">
                  {selectedPipeLine}
                </DropdownToggle>
                <DropdownMenu>
                  {/* <DropdownItem header>Header</DropdownItem> */}
                  <DropdownItem
                    onClick={() => handlePipelineSelection("Principal")}
                  >
                    Principal
                  </DropdownItem>
                  <DropdownItem onClick={() => handlePipelineSelection("Assitant Principal")}>
                    Assitant Principal
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          {/* <div className="col-md-3 d-flex justify-content-end"> */}
          {/* </div> */}
          <LeadersFilters
            onFiltersValueChange={onFiltersValueChangeHandler}
          ></LeadersFilters>
        </Col>
      </Row>
      <Row>
        <Col>
        {viewAll ? (
          <LeadersTable
            data={data}          
            onViewAll={viewAllHandler}  
          ></LeadersTable>
        ) : (
          <LeadersTable
            data={data.slice(0, 10)}          
            onViewAll={viewAllHandler}  
          ></LeadersTable>
        )}          
        </Col>
      </Row>
      <Row>
        <Col md={10}>
          <Link to={"/vacancy-report"}>{"<<"} Forecast Vacancy </Link>
        </Col>
        <Col md={2}>
          <Link to={"/identify-leaders"}> Develop Leaders {">>"}</Link>
        </Col>
      </Row>
    </div>
  );
};

export default IdentifyLeaders;
