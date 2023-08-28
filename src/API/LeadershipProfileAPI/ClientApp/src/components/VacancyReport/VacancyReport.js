import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

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
  Card,
  CardBody,
} from "reactstrap";

import { Link } from "react-router-dom";


import AditionalRiskFactors from "./AditionalRiskFactors/AditionalRiskFactors";
import WhoHasLeft from "./WhoHasLeft/WhoHasLeft";

import UseVacancyReport from "./UseVacancyReport";
import StaffTable from "../StaffTable";

// import CardList from './CardListComponents/CardList';
// import UseLandingPage from './UseLandingPage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = [2018, 2019, 2020, 2021, 2022, 2023];

export const lineChartData2 = {
  labels,
  datasets: [
    {
      label: "Vacancies",
      data: [2, 5, 3, 4, 7, 4],
      borderColor: "rgb(212, 125, 70)",
      backgroundColor: "rgba(212, 125, 70, 0.5)",
    },
  ],
};

export const lineChartData3 = {
  labels,
  datasets: [
    {
      label: "Vacancy",
      data: [6, 1, 2, 1, 4, 3],
      borderColor: "rgb(91, 101, 145)",
      backgroundColor: "rgba(91, 101, 145, 0.5)",
    },
  ],
};

const VacancyReport = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [activeComponent, setActiveComponent] = useState("table");
  // const { setColumnSort, sort, data, exportData, paging, setPage, error, setFilters, exportResults, buttonRef } = UseDirectory();

  // const callbackFilteredSearch = (searchData) => {
  //     setFilters(searchData);
  // }

  const {
    data,
    fetchData,
    selectedVacancyYear,
    setSelectedVacancyYear,
    selectedRole,
    setSelectedRole,
    lineChartData,
    projectedVacancy,
    elementaryLineChartData,
    projectedElementaryVacancy,
    middleLineChartData,
    projectedMiddleVacancy,
    highLineChartData,
    projectedHighVacancy,
    lineChartOptions,
    selectedSchoolLevel,
    setSelectedSchoolLevel,
  } = UseVacancyReport();

  const handleRoleSelection = (role) => {
    if (role != selectedRole) {
      fetchData(role);
      setSelectedRole(role);
    }
  };

  const getYear = (index) => {
    return labels[index];
  };

  const getSchoolLevel = (index) => {
    console.log('getSchoolLevel:', {index})
    switch (index) {
      case 1: return '[ALL]';
      case 2: return 'Elementary School';
      case 3: return 'Middle School';
      case 4: return 'High School';
      default: return null;
    }
  }

  const getFilteredDatabyYear = (year) => {
    var result = data.filter((d) => d.schoolYear == year);
    console.log("this are vacancies filtered by year:", year, result);
    return result;
  };

  return (
    <div className="container flex-container">
      <div className="row my-4">
        <div className="col-md-3">
          <Link to={"/vacancy-report"}>
            <Button
              outline
              color="default"
              className="yellow-border bold-text w-100 d-flex justify-content-center"
            >
              <h5 className="pt-1">Forecast Vacancies</h5>
            </Button>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to={"/identify-leaders"}>
            <Button
              outline
              color="default"
              className="gray-border bold-text  w-100 d-flex justify-content-center"
            >
              <h5 className="pt-1">Identify Leaders</h5>
            </Button>
          </Link>
        </div>

        <div className="col-md-3">
          <Button
            outline
            color="default"
            className="gray-border bold-text w-100 d-flex justify-content-center"
          >
            <h5 className="pt-1">Develop Leaders</h5>
          </Button>
        </div>
        <div className="col-md-3">
          <Link to="/directory?page=1&sortBy=asc&sortField=id">
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
      <div className="row my-4">
        <div className="col-md-7">
          <h3 className="fw-bold">How many vacancies are projected?</h3>
        </div>
        <div className="col-md-2  d-flex justify-content-end">
          <h3 className="fw-bold">Role</h3>
        </div>
        <div className="col-md-3 d-flex justify-content-end">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            className="ml-1 w-100"
          >
            <DropdownToggle caret color="primary" className="w-100">
              {selectedRole}
            </DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem header>Header</DropdownItem> */}
              <DropdownItem onClick={() => handleRoleSelection("Principal")}>
                Principal
              </DropdownItem>
              <DropdownItem onClick={() => handleRoleSelection("AP")}>
                AP
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="row my-4">
          <div
            className="col-md-4"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedSchoolLevel(1) }
          >
            <div
              className={
                selectedSchoolLevel == 1 ? "card p-3 yellow-border" : "card p-3"
              }
            >
              <div className="card-body">
                <div className="row">
                  <h5 className="color left-title">
                    {/* <span className="color bold-text yellow-color mr-1"> */}
                    All campuses
                    {/* </span> */}
                    {/* { selectedRole ?? ""} */}
                  </h5>
                  <h5 className="color left-title">
                    5-Year Average:{" "}
                    <span className="color bold-text yellow-color mr-1">
                      {projectedVacancy} Projected Vacancies
                    </span>
                  </h5>
                </div>
                <div className="row">
                  {/* <img alt="bars" src="/res/img/img1.png" width="100%" /> */}
                  <Line options={lineChartOptions} data={lineChartData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div
              className="row"
              style={{
                overflowX: "auto",
                witheSpace: "nowrap",
                flexWrap: "nowrap",
              }}
            >
              <div
                className="col-md-6 mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedSchoolLevel(2)}
              >
                <div
                  className={
                    selectedSchoolLevel == 2
                      ? "card p-3 yellow-border"
                      : "card p-3"
                  }
                >
                  <div className="card-body">
                    <div className="row">
                      <h5 className="color left-title">
                        {/* <span className="color bold-text yellow-color mr-1"> */}
                        Elementary School
                        {/* </span> */}
                        {/* { selectedRole ?? ""} */}
                      </h5>
                      <h5 className="color left-title">
                        5-Year Average:{" "}
                        <span className="color bold-text yellow-color mr-1">
                          {projectedElementaryVacancy} Projected Vacancies
                        </span>
                      </h5>
                    </div>
                    <div className="row">
                      <Line
                        options={lineChartOptions}
                        data={elementaryLineChartData}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-md-6"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedSchoolLevel(3)}
              >
                <div
                  className={
                    selectedSchoolLevel == 3
                      ? "card p-3 yellow-border"
                      : "card p-3"
                  }
                >
                  <div className="card-body">
                    <div className="row">
                      <h5 className="color left-title">Middle School</h5>
                      <h5 className="color left-title">
                        5-Year Average:{" "}
                        <span className="color bold-text yellow-color mr-1">
                          {projectedMiddleVacancy} Projected Vacancies
                        </span>
                      </h5>
                    </div>
                    <div className="row">
                      {/* <img alt="bars" src="/res/img/img1.png" width="100%" /> */}
                      <Line
                        options={lineChartOptions}
                        data={middleLineChartData}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-md-6"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedSchoolLevel(4)}
              >
                <div
                  className={
                    selectedSchoolLevel == 4
                      ? "card p-3 yellow-border"
                      : "card p-3"
                  }
                >
                  <div className="card-body">
                    <div className="row">
                      <h5 className="color left-title">High School</h5>
                      <h5 className="color left-title">
                        5-Year Average:{" "}
                        <span className="color bold-text yellow-color mr-1">
                          {projectedHighVacancy} Projected Vacancies
                        </span>
                      </h5>
                    </div>
                    <div className="row">
                      {/* <img alt="bars" src="/res/img/img1.png" width="100%" /> */}
                      <Line
                        options={lineChartOptions}
                        data={highLineChartData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedVacancyYear != null ? (
        <Row>
          <Card className="w-100 mb-4">
            {/* <CardHeader>
              <Row className="justify-content-between">                
                <h4 className="mx-2 my-1">Vacancy from {getYear(selectedVacancyYear)} </h4>
                <Button close size="lg" className="mx-3"
                  onClick={() => setSelectedVacancyYear(null)} />  
              </Row>
            </CardHeader> */}
            <CardBody>
              <Button
                close
                size="lg"
                className="mx-3"
                onClick={() => setSelectedVacancyYear(null)}
              />

            <StaffTable data={data.filter((d) => d.schoolYear == getYear(selectedVacancyYear) && ([d.schoolLevel, '[ALL]'].includes(getSchoolLevel(selectedSchoolLevel))))} />

            </CardBody>
          </Card>
        </Row>
      ) : (
        ""
      )}
      <Row>
        <Col md="12">
          {data && (
            <AditionalRiskFactors
              data={data}
              selectedRole={selectedRole}
            ></AditionalRiskFactors>
          )}

          {data && <WhoHasLeft data={data} selectedRole={selectedRole}></WhoHasLeft>}
        </Col>
      </Row>
      <Row>
        <Col md={10}>
          <Link to={"/vacancy-report"}>{"<<"} Vacancy Planning Cycle</Link>
        </Col>
        <Col md={2}>
          <Link to={"/identify-leaders"}>Identify Leaders {">>"}</Link>
        </Col>
      </Row>
    </div>
  );
};

export default VacancyReport;
