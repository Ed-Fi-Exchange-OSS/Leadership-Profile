// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect, useState } from "react";

import { Button } from "reactstrap";
import { Container, Row, Col, Card, CardTitle, CardText } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

import { TableViewIcon, CardViewIcon } from "../Icons";
import BreadcrumbList from "../Breadcrumb";
import AuthService from "../../utils/auth-service";
// import CardList from './CardListComponents/CardList';
// import UseLandingPage from './UseLandingPage';

const LandingPage = () => {
  const [activeComponent, setActiveComponent] = useState("table");
  
  const { isAuthenticated } = AuthService();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      let path = '/account/login';
      navigate(path);
    }
  }, [])
  // const { setColumnSort, sort, data, exportData, paging, setPage, error, setFilters, exportResults, buttonRef } = UseDirectory();

  // const callbackFilteredSearch = (searchData) => {
  //     setFilters(searchData);
  // }

  return (
    <div className="d-flex container-fluid flex-column">
      <div className="directory-div">
        <div className="directory-subtitle-controls">
          <div></div>
          <div className="view-style-buttons">
            <span className="view-style-label">View Style</span>
            <button
              disabled={activeComponent === "table"}
              color="primary"
              className="btn btn-primary view-style-button-first view-style-button"
              onClick={() => setActiveComponent("table")}
            >
              <TableViewIcon />
            </button>
            <button
              disabled={activeComponent === "card"}
              color="primary"
              className="btn btn-primary view-style-button"
              onClick={() => setActiveComponent("card")}
            >
              <CardViewIcon />
            </button>
          </div>
        </div>
        {/* <h2 className='directory-title'>Landing Page</h2> */}

        <Row className="cards-container mt-4 mx-auto ">
          <Col sm="3">
            <Card body>
              <CardTitle tag="h5" className="text-center">
                Forecast Vacancies
              </CardTitle>
              <CardText className="h-200">
                Examine what has historically led to vacancies and gather a
                hypothesis around upcoming vacancies
              </CardText>
              <Link to={"/vacancy-report"}>
                <Button className="w-100">Go >></Button>
              </Link>
            </Card>
          </Col>
          <Col sm="3">
            <Card body>
              <CardTitle tag="h5" className="text-center">
                Identify Leaders
              </CardTitle>
              <CardText className="h-200">
                Examine the current pool of staff and consider who might be
                ready or have high-potential to fill upcoming vacancies
              </CardText>
              <Link to={"/identify-leaders"}>
                <Button className="w-100">Go >></Button>
              </Link>            </Card>
          </Col>
          <Col sm="3">
            <Card body>
              <CardTitle tag="h5" className="text-center">
                Develop Leaders
              </CardTitle>
              <CardText className="h-200">
                Examine strengths and opportunities of the identified staff and
                leverage existing strengths within the district to provide
                targeted development and track progress
              </CardText>
              <Button>Go >></Button>
            </Card>
          </Col>
          <Col sm="3">
            <Card body>
              <CardTitle tag="h5" className="text-center">
                Select Leaders
              </CardTitle>
              <CardText className="h-200">
                Examine current openings, campus needs, and track the extent to
                which identified staff move through the selection progress and
                successfully transition into new roles
              </CardText>
              <Link to={"/directory"}>
                <Button className="w-100">Go >></Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>

      <div>
        {/* <a className="selected-filters-clear mx-3" onClick={() => exportResults()}>Export Results</a> */}
      </div>
      {/* <Button className="selected-filters-clear mx-3" onClick={() => exportResults()}>Export Results</Button> */}
    </div>
  );
};

export default LandingPage;
