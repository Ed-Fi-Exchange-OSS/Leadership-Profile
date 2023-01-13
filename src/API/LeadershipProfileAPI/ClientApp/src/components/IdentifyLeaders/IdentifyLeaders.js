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

import { TableViewIcon, CardViewIcon } from "../Icons";
import BreadcrumbList from "../Breadcrumb";

import LeadersTable from "./LeadersTable/LeadersTable.js";
import LeadersFilters from "./LeadersFilters/LeadersFilters";
import LeadersCharts from "./LeadersCharts/LeadersCharts";
import UseIdentifyLeaders from "./UseIdentifyLeaders";



const IdentifyLeaders = () => {

  const { 
    data ,
    fetchData
  } = UseIdentifyLeaders();

  const onFiltersValueChangeHandler = (filters) => {
    fetchData(filters);
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPipeLine, setSelectedPipeLine] = useState("Principal");
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handlePipelineSelection = (role) => {
    if ( role != selectedPipeLine) {
      fetchData(role);
      setSelectedPipeLine(role);
    }
  }


  return (
    <div className="container flex-container">
      <div className="row my-4">
        <div className="col-md-3">
        <Link to={"/vacancy-report"}>
          <Button outline color="default" className="gray-border bold-text w-100 d-flex justify-content-center" >
            <h5 className="pt-1">Forecast Vacancies</h5>
          </Button>
          </Link>
        </div>
        <div className="col-md-3">
        <Link to={"/identify-leaders"}>
          <Button outline  color="default" className="yellow-border bold-text  w-100 d-flex justify-content-center" >
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
      <Row>
        <Col md="6">
          <LeadersCharts></LeadersCharts>
        </Col>
        <Col md="6">
          <Row >
            <Col >
            {/* <div className="col-md-2  d-flex justify-content-end"> */}
          <h3 className="fw-bold">Pipeline</h3>
        {/* </div>     */}
            </Col>
            <Col >
          <Dropdown isOpen={dropdownOpen} toggle={toggle} className="ml-1 w-100" >
            <DropdownToggle caret color="primary" className="w-100">{selectedPipeLine}</DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem header>Header</DropdownItem> */}
              <DropdownItem onClick={() => handlePipelineSelection('Principal')}>Principal</DropdownItem>
              <DropdownItem onClick={() => handlePipelineSelection('AP')}>AP</DropdownItem>
            </DropdownMenu>
          </Dropdown>
              
            </Col>
          </Row>
        {/* <div className="col-md-3 d-flex justify-content-end"> */}
        {/* </div> */}
          <LeadersFilters onFiltersValueChange={onFiltersValueChangeHandler}></LeadersFilters>
        </Col>
      </Row>
      <Row>
        <Col>
          <LeadersTable data={data}></LeadersTable>
        </Col>
      </Row>
    </div>
  );
};

export default IdentifyLeaders;
