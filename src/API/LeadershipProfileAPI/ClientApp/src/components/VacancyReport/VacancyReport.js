import React, { useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from 'faker';

// import img1 from './res/img/img1.PNG'; // Tell webpack this JS file uses this image


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

import { TableViewIcon, CardViewIcon } from "../Icons";
import BreadcrumbList from "../Breadcrumb";

import AditionalRiskFactors from "./AditionalRiskFactors/AditionalRiskFactors";
import WhoHasLeft from "./WhoHasLeft/WhoHasLeft";

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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const labels = [
  "Retirement",
  "Attrition",
  "Internal Promotion",
  "Internal Transfer",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Vacancy",
      data: [16, 24, 11, 49],
      backgroundColor: "rgba(63, 191, 127, 0.5)",
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

  return (
    <div className="container flex-container">
      <div className="row my-4">
        <div className="col-md-3">
          <Button outline color="primary">
            <h5 className="pt-1">Forecast Vacancies</h5>
          </Button>
        </div>
        <div className="col-md-3">
          <Button outline color="primary">
            <h5 className="pt-1">Identify Leaders</h5>
          </Button>
        </div>
        <div className="col-md-3">
          <Button outline color="primary">
            <h5 className="pt-1">Select Leaders</h5>
          </Button>
        </div>
        <div className="col-md-3">
          <Button outline color="primary" className="w-100">
            <h5 className="pt-1">Develop Leaders</h5>
          </Button>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-6">
          <p>How many vacancies are projected?</p>
        </div>
        <div className="col-md-2">
          <h6>Role</h6>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <Dropdown isOpen={dropdownOpen} toggle={toggle} className="ml-auto">
            <DropdownToggle caret>Principal</DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem header>Header</DropdownItem> */}
              <DropdownItem>Principal</DropdownItem>
              <DropdownItem>AP</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="row my-4">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <p>1 to 7</p>
                  <p>Principal</p>
                </div>
                <div className="row">
                  <p>Projected Vacancies</p>
                </div>
                <img alt="bars" src="/res/img/img1.png" width="100%" />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <p>ES</p>
                </div>
                <img alt="bars" src="/res/img/img1.png" width="100%" />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <p>MS</p>
                </div>
                <img alt="bars" src="/res/img/img1.png" width="100%" />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">                  
                  <p>HS</p>
                </div>
                <img alt="bars" src="" width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Row>        
        <Col md="12">
          <AditionalRiskFactors></AditionalRiskFactors>
          <WhoHasLeft></WhoHasLeft>
        </Col>
      </Row>
    </div>
  );
};

export default VacancyReport;
