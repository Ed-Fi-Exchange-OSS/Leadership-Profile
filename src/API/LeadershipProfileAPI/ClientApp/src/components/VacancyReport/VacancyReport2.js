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
    }
  ],
};

const VacancyReport = () => {
  const [activeComponent, setActiveComponent] = useState("table");
  // const { setColumnSort, sort, data, exportData, paging, setPage, error, setFilters, exportResults, buttonRef } = UseDirectory();

  // const callbackFilteredSearch = (searchData) => {
  //     setFilters(searchData);
  // }

  return (
    <div className="d-flex container-fluid flex-column">

      <div className="row mt-4 projected-vacancy">
        <div className="w-100">
          <h2 className="">Forecast Vacancies</h2>
          <p className="directory-paragraph">
            What historically has caused vacancies and what is out baseline
            vacancy projection?
          </p>
        </div>
      
        <Card
          className="my-2"
          color="primary"
          outline
          style={{
            width: "18rem",
            marginTop: "100px",
          }}
        >
          <CardBody>
            <p> Description: </p>
            <p> How to use this data: </p>
            <p> Guiding Questions: </p>
          </CardBody>
        </Card>
      </div>

      <div className="row mt-4 projected-vacancy">
        <div className="col-md-6">          
          <div className="row mt-4">
            <div className="col-md-4 m-auto">
              <Link to={'/vacancy-report-details'}>

                <Button sm>Expand View</Button>
              </Link>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-9 text-center">
                  <h5 className="mx-auto px-auto">Projected Principals</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">HS</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table"></span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">MS</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table">1</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">ES</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table">2</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">Total</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table">3</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <h5>Cause of vacancy past 5 years</h5>          
            <Bar options={options} data={data} />
          </div>
        </div>
        <div className="col-md-6">
        <div className="row mt-4">
            <div className="col-md-4 m-auto">
              <Button sm>Expand View</Button>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-9 text-center">
                  <h5 className="mx-auto px-auto">Projected APs</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">HS</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table"></span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">MS</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table">1</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">ES</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table">2</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="row">
                    <span className="m-table">Total</span>
                  </div>
                </div>
                <div className="col-md-9 text-center bg-orange">
                  <span className="m-table">3</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <h5>Cause of vacancy past 5 years</h5>          
            <Bar options={options} data={data} />
          </div>
        </div>
      </div>

      <Table className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Campus</th>
            <th>Name</th>
            <th>Campus Rating</th>
            <th>Leave Date</th>
            <th>Gender</th>
            <th>Race</th>
            <th>Performance Rating</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr> */}
        </tbody>
      </Table>



      <div>
        {/* <a className="selected-filters-clear mx-3" onClick={() => exportResults()}>Export Results</a> */}
      </div>
      {/* <Button className="selected-filters-clear mx-3" onClick={() => exportResults()}>Export Results</Button> */}
    </div>
  );
};

export default VacancyReport;
