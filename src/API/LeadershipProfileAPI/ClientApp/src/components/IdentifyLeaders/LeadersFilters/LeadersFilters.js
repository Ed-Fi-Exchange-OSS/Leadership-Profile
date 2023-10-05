// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { Component, useState } from "react";

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
  Form,
  FormGroup,
} from "reactstrap";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

class LeadersFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: [1,2,3,4],
      schoolLevels: [1, 2, 3],
      highestDegrees: [1, 2, 3],
      hasCertification: [1, 2],
      yearsOfExperience: [1, 2],
      overallScore: [1, 2, 3, 4, 5],
      domainOneScore: [1, 2, 3, 4, 5],
      domainTwoScore: [1, 2, 3, 4, 5],
      domainThreeScore: [1, 2, 3, 4, 5],
      domainFourScore: [1, 2, 3, 4, 5],
      domainFiveScore: [1, 2, 3, 4, 5]
    };

    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  onSliderUpdateHandler = (data, property) => {
    // this.props.onFiltersValueChange(this.state);
    //var newValue = [];
    //for(var i = parseInt(data[0]); i <= parseInt(data[1]); i++) {
    //  if (i != 0) newValue.push(i);
    //}
    this.state[property] = data;
    this.props.onFiltersValueChange(this.state);
  }

  onCheckboxBtnClick = (filter, value) => {
    const index = this.state[filter].indexOf(value);
    if (index < 0) {
      this.state[filter].push(value);
    } else {
      this.state[filter].splice(index, 1);
    }
    let newState = {};
    newState[filter] =  this.state[filter];
    this.setState(newState);
    console.log("Firing data fetch with: ", this.state);
    this.props.onFiltersValueChange(this.state);
  };


  format = {
    to: function (value) {
      return String(value);
    },
    from: function (value) {
      return Number(value);
  }};

  filterPips = function(value, type) {
    return value % 5 == 0 ? 1
      : value % 1 == 0 ? 2
      : 0;
  }


  render() {
    return (
      <Card style={{backgroundColor: 'lightgray'}}>
        <CardTitle className="m-3" tag={'h4'}>
          Criteria for Identification
        </CardTitle>
        <CardBody>

      <Form className="filters-form">
        <Row>
          <Col md="6" className="px-4">
          <FormGroup row className="d-block">
              <Col md="12">
                <label>Overall Performance Score:</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 5]}
                  step={1}
                  connect={true}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 5,
                  }}
                  format={this.format}
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'overallScore')}
                  pips= {{
                    mode: 'steps',
                    density: 100,
                    filter: () => 1
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 1:</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 5]}
                  step={1}
                  connect={true}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 5,
                  }}
                  format={this.format}
                  pips= {{
                    mode: 'steps',
                    density: 100,
                    filter: () => 1
                  }}
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'domainOneScore')}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 2:</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 5]}
                  step={1}
                  connect={true}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 5,
                  }}
                  format={this.format}
                  pips= {{
                    mode: 'steps',
                    density: 100,
                    filter: () => 1
                  }}
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'domainTwoScore')}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 3:</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 5]}
                  step={1}
                  connect={true}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 5,
                  }}
                  format={this.format}
                  pips= {{
                    mode: 'steps',
                    density: 100,
                    filter: () => 1
                  }}
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'domainThreeScore')}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 4:</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 5]}
                  step={1}
                  connect={true}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 5,
                  }}
                  format={this.format}
                  pips= {{
                    mode: 'steps',
                    density: 100,
                    filter: () => 1
                  }}
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'domainFourScore')}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 5:</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 5]}
                  step={1}
                  connect={true}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 5,
                  }}
                  format={this.format}
                  pips= {{
                    mode: 'steps',
                    density: 100,
                    filter: () => 1
                  }}
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'domainFiveScore')}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup row>
              <Col md="12">
                <label>Leadership Role</label>
              </Col>
              <Col>
                <Row className="">
                  <Button
                    size="sm"
                    color={this.state.roles.includes(1) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('roles', 1)}
                    active={this.state.roles.includes(1)}
                    className="mx-1"
                  >
                    Principal
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.roles.includes(2) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('roles', 2)}
                    active={this.state.roles.includes(2)}
                    className="mx-1"
                  >
                    AP
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.roles.includes(3) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('roles', 3)}
                    active={this.state.roles.includes(3)}
                    className="mx-1"
                  >
                    Teacher
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.roles.includes(4) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('roles', 4)}
                    active={this.state.roles.includes(4)}
                    className="mx-1 mt-1"
                  >
                    Teacher Leader
                  </Button>
                </Row>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="12">
                <label>School Level</label>
              </Col>
              <Col>
                <Row className="">
                  <Button
                    size="sm"
                    color={this.state.schoolLevels.includes(1) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('schoolLevels', 1)}
                    active={this.state.schoolLevels.includes(1)}
                    className="mx-1"
                  >
                    EL
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.schoolLevels.includes(2) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('schoolLevels', 2)}
                    active={this.state.schoolLevels.includes(2)}
                    className="mx-1"
                  >
                    MS
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.schoolLevels.includes(3) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('schoolLevels', 3)}
                    active={this.state.schoolLevels.includes(3)}
                    className="mx-1"
                  >
                    HS
                  </Button>
                </Row>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="12">
                <label>Highest Degree Earned</label>
              </Col>
              <Col>
                <Row className="">
                  <Button
                    size="sm"
                    color={this.state.highestDegrees.includes(1) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('highestDegrees', 1)}
                    active={this.state.highestDegrees.includes(1)}
                    className="mx-1"
                  >
                    Bachelors
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.highestDegrees.includes(2) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('highestDegrees', 2)}
                    active={this.state.highestDegrees.includes(2)}
                    className="mx-1"
                  >
                    Masters
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.highestDegrees.includes(3) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('highestDegrees', 3)}
                    active={this.state.highestDegrees.includes(3)}
                    className="mx-1 mt-1"
                  >
                    Doctorate
                  </Button>
                </Row>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="12">
                <label>Has Principal Certification</label>
              </Col>
              <Col>
                <Row className="">
                  <Button
                    size="sm"
                    color={this.state.hasCertification.includes(1) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('hasCertification', 1)}
                    active={this.state.hasCertification.includes(1)}
                    className="mx-1"
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    color={this.state.hasCertification.includes(2) ? "primary" : "secondary"}
                    onClick={() => this.onCheckboxBtnClick('hasCertification', 2)}
                    active={this.state.hasCertification.includes(2)}
                    className="mx-1"
                  >
                    No
                  </Button>
                </Row>
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Years of Experience</label>
              </Col>
              <Col>
                {/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
                <Nouislider
                  // key={item}
                  // id={item}
                  start={[0, 36]}
                  connect={true}
                  step={1}
                  // connect={[true, false]}
                  // orientation="vertical"
                  range={{
                    min: 0,
                    max: 36,
                  }}
                  pips= {{
                    mode: 'count',
                    values: 6,
                    density: 4,
                }}
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Form>
        </CardBody>
      </Card>
    );
  }
}

export default LeadersFilters;
