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
      overallScore: [1,2,3,4,5]
    };

    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  onSliderUpdateHandler = (data, property) => {
    // this.props.onFiltersValueChange(this.state);
    console.log(data);
    var newValue = [];
    for(var i = parseInt(data[0]); i <= parseInt(data[1]); i++) {
      if (i != 0) newValue.push(i);
    }
    this.state[property] = newValue;
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

  
  render() {
    return (
      <Form className="filters-form">
        <Row>
          <Col md="6" className="px-4">
          <FormGroup row className="d-block">
              <Col md="12">
                <label>Average Score</label>
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
                  onUpdate={(data) => this.onSliderUpdateHandler(data, 'overallScore')}
                  pips= {{
                    mode: 'steps',
                    stepped: true,
                    density: 20
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 1</label>
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
                  pips= {{
                    mode: 'steps',
                    stepped: true,
                    density: 20
                  }}
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 2</label>
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
                  pips= {{
                    mode: 'steps',
                    stepped: true,
                    density: 20
                  }}
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 3</label>
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
                  pips= {{
                    mode: 'steps',
                    stepped: true,
                    density: 20
                  }}
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup>
            {/* <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 4: High Quality Curriculum</label>
              </Col>
              <Col>
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
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="d-block">
              <Col md="12">
                <label>Domain 5: Effective Instruction</label>
              </Col>
              <Col>
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
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup> */}
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
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('roles', 1)}
                    active={this.state.roles.includes(1)}
                    className="mx-1"
                  >
                    Principal
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('roles', 2)}
                    active={this.state.roles.includes(2)}
                    className="mx-1"
                  >
                    AP
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('roles', 3)}
                    active={this.state.roles.includes(3)}
                    className="mx-1"
                  >
                    Teacher
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
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
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('schoolLevels', 1)}
                    active={this.state.schoolLevels.includes(1)}
                    className="mx-1"
                  >
                    EL
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('schoolLevels', 2)}
                    active={this.state.schoolLevels.includes(2)}
                    className="mx-1"
                  >
                    MS
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
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
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('highestDegrees', 1)}
                    active={this.state.highestDegrees.includes(1)}
                    className="mx-1"
                  >
                    Bachelors
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('highestDegrees', 2)}
                    active={this.state.highestDegrees.includes(2)}
                    className="mx-1"
                  >
                    Masters
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('highestDegrees', 3)}
                    active={this.state.highestDegrees.includes(3)}
                    className="mx-1"
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
                    color="primary"
                    onClick={() => this.onCheckboxBtnClick('hasCertification', 1)}
                    active={this.state.hasCertification.includes(1)}
                    className="mx-1"
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
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
                    mode: 'range',
                    stepped: true,
                    density: 5
                  }}
                  // onUpdate={this.onUpdate(index)}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default LeadersFilters;
