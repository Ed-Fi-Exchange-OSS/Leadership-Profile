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
import { Bar, Line } from "react-chartjs-2";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CloseButton
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

import UseVacancyReport from "./UseVacancyReport";

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
  maintainAspectRatio: true,
  elements: {
    point: {
      radius : customRadius,
      display: true
    }
  }
};

function customRadius( context )
{
  let index = context.dataIndex;
  let value = context.dataset.data[ index ];
  return index === 5 ?
         10 :
         2;
}

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
    lineChartData1,
    lineChartOptions,
    selectedSchoolLevel,
    setSelectedSchoolLevel
  } = UseVacancyReport();


  const handleRoleSelection = (role) => {
    if ( role != selectedRole) {
      fetchData(role);
      setSelectedRole(role);
    }
  }

  const getYear = (index) => {
    return labels[index]
  }

  const getFilteredDatabyYear = (year)  => {
    var result =  data.filter(d => d.schoolYear == year);
    console.log("this are vacancies filtered by year:", year, result);
    return result;
  }

  var role;

  useEffect(() => {
    // fetchData(role);
  });

  

  return (
    <div className="container flex-container">
      <div className="row my-4">
      <div className="col-md-3">
        <Link to={"/vacancy-report"}>
          <Button outline color="default" className="yellow-border bold-text w-100 d-flex justify-content-center" >
            <h5 className="pt-1">Forecast Vacancies</h5>
          </Button>
          </Link>
        </div>
        <div className="col-md-3">
        <Link to={"/identify-leaders"}>
          <Button outline  color="default" className="gray-border bold-text  w-100 d-flex justify-content-center" >
            <h5 className="pt-1">Identify Leaders</h5>
          </Button>
          </Link>
        </div>
        
        <div className="col-md-3">
          <Button outline color="default" className="gray-border bold-text w-100 d-flex justify-content-center" >
            <h5 className="pt-1">Develop Leaders</h5>
          </Button>
        </div>
        <div className="col-md-3">
          <Button outline  color="default" className="gray-border bold-text w-100 d-flex justify-content-center" >
            <h5 className="pt-1">Select Leaders</h5>
          </Button>
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
          <Dropdown isOpen={dropdownOpen} toggle={toggle} className="ml-1 w-100" >
            <DropdownToggle caret color="primary" className="w-100">{selectedRole}</DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem header>Header</DropdownItem> */}
              <DropdownItem onClick={() => handleRoleSelection('Principal')}>Principal</DropdownItem>
              <DropdownItem onClick={() => handleRoleSelection('AP')}>AP</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="row my-4">
          <div className="col-md-4" style={{cursor: "pointer"}} onClick={() => setSelectedSchoolLevel(1)}>
            <div className={selectedSchoolLevel == 1 ? "card p-3 yellow-border" : "card p-3"}>
              <div className="card-body">
                <div className="row">
                  <h5 className="color left-title">
                    <span className="color bold-text yellow-color mr-1">
                      {" "}
                      1 to 7{" "}
                    </span>
                    { selectedRole ?? ""}
                  </h5>
                  <h5 className="left-title bold-text yellow-color">
                    Projected Vacancies
                  </h5>
                </div>
                <div className="row">
                  {/* <img alt="bars" src="/res/img/img1.png" width="100%" /> */}
                  <Line options={lineChartOptions} data={lineChartData1} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4" style={{cursor: "pointer"}} onClick={() => setSelectedSchoolLevel(2)}>
            <div className={selectedSchoolLevel == 2 ? "card p-3 yellow-border" : "card p-3"}>
              <div className="card-body">
                <div className="row">
                  <h5 className="left-title">
                    ES                    
                  </h5>
                </div>
                <div className="row">
                  {/* <img alt="bars" src="/res/img/img1.png" width="100%" /> */}
                  <Line options={options} data={lineChartData2} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4" style={{cursor: "pointer"}} onClick={() => setSelectedSchoolLevel(3)}>
            <div className={selectedSchoolLevel == 3 ? "card p-3 yellow-border" : "card p-3"}>
              <div className="card-body">
                <div className="row">
                  <h5 className="left-title">
                    MS                    
                  </h5>
                </div>
                <div className="row">
                  {/* <img alt="bars" src="/res/img/img1.png" width="100%" /> */}
                  <Line options={options} data={lineChartData3} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      { selectedVacancyYear != null ? (
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
            <Button close size="lg" className="mx-3"
                  onClick={() => setSelectedVacancyYear(null)} />  
              <Table borderless>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>School</th>
                    <th>Level</th>
                    <th>Departure Date</th>
                    <th>Gender</th>
                    <th>Race</th>
                    <th>Vacancy Cause</th>
                    {/* <th>Retirement reason</th> */}
                  </tr>
                </thead>
                <tbody>
                  {/* { data ? getFilteredDatabyYear(selectedVacancyYear).map( */}
                  { data.filter(d => d.schoolYear == getYear(selectedVacancyYear)).map(
                    (element, i) => (
                      <tr key={'year-table-record-' + i}>
                        <th scope="row">{i + 1}</th>
                        <td>
                          {/* {element.fullNameAnnon} */}
                          <Link to={`profile/${207221}`}>{element.fullNameAnnon}</Link>
                        </td>
                        <td>{element.schoolNameAnnon}</td>
                        <td>{element.schoolLevel}</td>
                        <td>{element.schoolYear}</td>
                        <td>{element.gender}</td>
                        <td>{element.race}</td>
                        <td>{element.vacancyCause}</td>
                        <td></td>
                        {/* <td>@mdo</td> */}
                      </tr>
                    )
                  )}          
                </tbody>
              </Table>
            </CardBody>        
          </Card>
        </Row>
      ) : ""}
      <Row>
        <Col md="12">
          { data && (
            <AditionalRiskFactors data={data} selectedRole={selectedRole}></AditionalRiskFactors>
          )}

          { data && (
            <WhoHasLeft data={data}></WhoHasLeft>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default VacancyReport;
