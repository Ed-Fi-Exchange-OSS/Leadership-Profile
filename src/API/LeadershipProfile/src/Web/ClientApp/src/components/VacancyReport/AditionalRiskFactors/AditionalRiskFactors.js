// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Fragment, useState } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Tooltip } from "reactstrap";
import UseAditionalRiskFactors from "./UseAditionalRiskFactors";
import StaffTable from "../../StaffTable";

const AditionalRiskFactors = ({ data, selectedRole }) => {
  const {
    vacancyRateData,
    eligibleForRetirementData,
    eligibleForRetirementNowCount,
    eligibleForRetirementSoonCount,
    currentPerformanceData,
    scoreCount,
    activeStaffData,
    turnoverPercent
  } = UseAditionalRiskFactors(data, selectedRole) ?? {};

  const [schoolFilter, setSchoolFilter] = useState(null);

  const getReasonColor = (reason) => {
    var color = "";
    switch (reason) {
      case "Attrition":
        color = "orange";
        break;
      case "Retirement":
        color = "brown";
        break;
      case "Internal Transfer":
        color = "pink";
        break;
      case "Internal Promotion":
        color = "green";
        break;
      case "Finished Year":
        color = "purple";
        break;
      default:
        color = "white";
        break;
    }
    return color;
  };

  const [hoveredVacancy, setHoveredVacancy] = useState(null);
  const [hoveredEligible, setHoveredEligible] = useState(null);
  const [hoveredPerformance, setHoveredPerformance] = useState(null);

  const schoolCategories = [
    "Elementary School",
    "Middle School",
    "High School",
  ];
  const [schoolCategoryOpen, setSchoolCategoryOpen] = useState(false);
  const schoolCategoryToggle = () =>
    setSchoolCategoryOpen((prevState) => !prevState);
  const [selectedSchoolCategory, setSelectedSchoolCategory] = useState(null);

  return (
    <Fragment>
      <Row>
        <Col md="12" className="mb-2">
          <Row>
            <Col md="8">
              <h3 className="fw-bold">
                What additional risk factors impact vacancies?
              </h3>
            </Col>
            <Col>
              <Dropdown
                isOpen={schoolCategoryOpen}
                toggle={schoolCategoryToggle}
                className="ml-1 w-100"
              >
                <DropdownToggle caret color="primary" className="w-100">
                  {selectedSchoolCategory ?? "School Categories"}
                </DropdownToggle>
                <DropdownMenu>
                  {schoolCategories.map((sc, index) => {
                    return (
                      <DropdownItem
                        onClick={(e) => setSelectedSchoolCategory(sc)}
                      >
                        {sc}
                      </DropdownItem>
                    );
                  })}
                  <DropdownItem
                    onClick={(e) => setSelectedSchoolCategory(null)}
                  >
                    ALL
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </Col>
        <Col md="6" className="mt-3">
          <h5 className="color left-title">
            <span className="color orange-bold-text mr-1">
              {turnoverPercent}%  {" "}
            </span>
            Turnover 5 years
          </h5>
          <h5 className="left-title">5-Year Vacancy Rate</h5>
          <Row className="my-3 retirement-max-height">
            <Col>
              {vacancyRateData
                ? vacancyRateData
                    .filter(
                      (school) =>
                        !selectedSchoolCategory ||
                        school.vacancy[0]?.schoolLevel ===
                          selectedSchoolCategory
                    )
                    .map((school, i) => (
                      <Row
                        key={"risk-factor-recor-" + i}
                        onClick={(e) => {
                          //   setSchoolFilter(school.name);
                          e.preventDefault();
                        }}
                      >
                        <Col md="8">
                          <a href="#">{school.name}</a>
                        </Col>
                        <Col md="1">{school.vacancy.length}</Col>
                        <Col md="3">
                          <Row>
                            {school.vacancy.map((vacancy, j) => (
                              <div
                                key={
                                  "vacancy-risk-factor-element-" + i + "-" + j
                                }
                                id={
                                  "vacancy-risk-factor-element-" + i + "-" + j
                                }
                                onMouseEnter={() =>
                                  setHoveredVacancy(
                                    "vacancy-risk-factor-element-" + i + "-" + j
                                  )
                                }
                                onMouseLeave={() => setHoveredVacancy(null)}
                                style={{
                                  width: "20px",
                                }}
                              >
                                <div
                                  style={{
                                    marginLeft: "3px",
                                    marginRight: "3px",
                                    marginTop: "3px",
                                    width: "20px",
                                    height: "20px",
                                    border: "solid 1px",
                                  }}
                                  className={getReasonColor(
                                    vacancy.vacancyCause
                                  )}
                                ></div>
                                <Tooltip
                                  target={
                                    "vacancy-risk-factor-element-" + i + "-" + j
                                  }
                                  isOpen={
                                    hoveredVacancy &&
                                    hoveredVacancy ==
                                      "vacancy-risk-factor-element-" +
                                        i +
                                        "-" +
                                        j
                                  }
                                >
                                  <p>
                                    Name: {vacancy.fullName} <br />
                                    Year: {vacancy.schoolYear} <br />
                                    Reason: {vacancy.vacancyCause}
                                  </p>
                                </Tooltip>
                              </div>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    ))
                : "Empty"}
            </Col>
          </Row>
        </Col>
        <Col md="3" className="mt-3">
          <h5 className="left-title gray-bold-text">
            {selectedRole ?? ""} Eligibility for Retirement
          </h5>
          <Row className="my-3 retirement-max-height">
            <Col>
              {activeStaffData
                ? Object.keys(activeStaffData)
                    .filter(
                      (schoolName) =>
                        !selectedSchoolCategory ||
                        activeStaffData[schoolName][0]?.schoolCategory ===
                          selectedSchoolCategory
                    )
                    .map((nameOfInstitution, i) => (
                      <Row
                        key={"eligible-for-retirement-" + i}
                        onClick={(e) => {
                          // setSchoolFilter(school.schoolName);
                          e.preventDefault();
                        }}
                      >
                        <Col md="8">
                          <a href="">{nameOfInstitution}</a>
                        </Col>
                        <Col md="4">
                          <Row>
                          {activeStaffData[nameOfInstitution].map((staff, j) => (

                              <div
                                key={"eligible-for-retirement-" + i }
                                id={"eligible-for-retirement-" + i }
                                onMouseEnter={() =>
                                  setHoveredEligible(
                                    "eligible-for-retirement-" + i 
                                  )
                                }
                                onMouseLeave={() => setHoveredEligible(null)}
                                style={{
                                  width: "20px",
                                }}
                              >
                                <div
                                  className={
                                    "circle color-circle-" +
                                    (staff.retirementEligibility ? 4 : (staff.yearsToRetirement > 0 && staff.yearsToRetirement <= 2 ? 3 : 0))
                                  }
                                ></div>
                                <Tooltip
                                  target={
                                    "eligible-for-retirement-" + i 
                                  }
                                  isOpen={
                                    hoveredEligible &&
                                    hoveredEligible ==
                                      "eligible-for-retirement-" + i 
                                  }
                                >
                                  {staff.fullName}
                                </Tooltip>
                              </div>
                             ))}
                          </Row>
                        </Col>
                      </Row>
                    ))
                : ""}
            </Col>
          </Row>
          <h6 className="left-title blue-bold-text">
            {eligibleForRetirementNowCount ? eligibleForRetirementNowCount : 0}{" "}
            Eligible Now
          </h6>
          <h6 className="left-title gray-bold-text">
          {eligibleForRetirementSoonCount ? eligibleForRetirementSoonCount : 0}{" "}
            Eligible in 1-2 Years
          </h6>
        </Col>
        <Col md="3" className="mt-3">
          {/* <h5 className="color left-title">
          <span className="color green-bold-text mr-1">
            {" "}
            {currentPerformanceData ? currentPerformanceData.length : 0}{" "}
          </span>
          { selectedRole + "s" ?? "" }
        </h5> */}
          <h5 className="left-title green-bold-text">
            Current {selectedRole} Performance
          </h5>
          {/* <Row className="my-3 retirement-max-height">
            <Col>
              {currentPerformanceData
                ? currentPerformanceData
                    .filter(
                      (school) =>
                        !selectedSchoolCategory ||
                        school.staff[0]?.schoolLevel === selectedSchoolCategory
                    )
                    .map((performance, i) => (
                      <Row
                        key={"performance-record-" + i}
                        onClick={(e) => {
                          // setSchoolFilter(performance.name);
                          e.preventDefault();
                        }}
                      >
                        <Col md="8">
                          <a href="">{performance.name}</a>
                        </Col>
                        <Col md="4">
                          <Row>
                            {performance.staff.map((staff, j) => (
                              <div
                                key={"performance-staff-" + i + "-" + j}
                                id={"performance-staff-" + i + "-" + j}
                                onMouseEnter={() =>
                                  setHoveredPerformance(
                                    "performance-staff-" + i + "-" + j
                                  )
                                }
                                onMouseLeave={() => setHoveredPerformance(null)}
                                style={{
                                  width: "20px",
                                }}
                              >
                                <div
                                  // className="green-circle"
                                  className={
                                    "circle color-circle-" +
                                    Math.round(staff.overallScore)
                                  }
                                ></div>
                                <Tooltip
                                  target={"performance-staff-" + i + "-" + j}
                                  isOpen={
                                    hoveredPerformance &&
                                    hoveredPerformance ==
                                      "performance-staff-" + i + "-" + j
                                  }
                                >
                                  {staff.fullNameAnnon}
                                </Tooltip>
                              </div>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    ))
                : ""}
            </Col>
          </Row> */}
          <Row className="my-3 retirement-max-height">
            <Col>
              {activeStaffData
                ? Object.keys(activeStaffData)
                .filter(
                  (schoolName) =>
                    !selectedSchoolCategory ||
                    activeStaffData[schoolName][0]?.schoolCategory ===
                      selectedSchoolCategory
                )
                    .map((nameOfInstitution, i) => (
                      <Row
                        key={"performance-record-" + i}
                        onClick={(e) => {
                          // setSchoolFilter(performance.name);
                          e.preventDefault();
                        }}
                      >
                        <Col md="8">
                          <a href="">{nameOfInstitution}</a>
                        </Col>
                        <Col md="4">
                        <Row>
                                                    {activeStaffData[nameOfInstitution].map((staff, j) => (
                              <div
                                key={"performance-staff-" + i}
                                id={"performance-staff-" + i}
                                onMouseEnter={() =>
                                  setHoveredPerformance(
                                    "performance-staff-" + i
                                  )
                                }
                                onMouseLeave={() => setHoveredPerformance(null)}
                                style={{
                                  width: "20px",
                                }}
                              >
                                <div
                                  // className="green-circle"
                                  className={
                                    "circle color-circle-" +
                                    Math.round(staff.rating)
                                  }
                                ></div>
                                <Tooltip
                                  target={"performance-staff-" + i}
                                  isOpen={
                                    hoveredPerformance &&
                                    hoveredPerformance ==
                                      "performance-staff-" + i
                                  }
                                >
                                  {staff.fullName}
                                </Tooltip>
                              </div>
                              ))}
                          </Row>
                        </Col>
                      </Row>
                    ))
                : ""}
            </Col>
          </Row>
          {/* <p className="m-0 p-0 left-title soft-orange-bold-text"> */}
          <Row className="m-0 p-0 left-title soft-orange-bold-text">
            <Col md={1}>{scoreCount ? scoreCount[0] : 0}</Col>
            <Col md={8}>at Overall Score 1</Col>
            {/* </p> */}
          </Row>
          <Row className="m-0 p-0 left-title soft-yellow-bold-text">
            <Col md={1}>{scoreCount ? scoreCount[1] : 0}</Col>
            <Col md={10}>at Overall Score 2</Col>
            {/* </p> */}
          </Row>
          <Row className="m-0 p-0 left-title gray-bold-text">
            <Col md={1}>{scoreCount ? scoreCount[2] : 0}</Col>
            <Col md={10}>at Overall Score 3</Col>
            {/* </p> */}
          </Row>
          <Row className="m-0 p-0 left-title soft-blue-bold-text">
            <Col md={1}>{scoreCount ? scoreCount[3] : 0}</Col>
            <Col md={10}>at Overall Score 4</Col>
            {/* </p> */}
          </Row>
          <Row className="m-0 p-0 left-title soft-green-bold-text">
            <Col md={1}>{scoreCount ? scoreCount[4] : 0}</Col>
            <Col md={10}>at Overall Score 5</Col>
            {/* </p> */}
          </Row>
        </Col>
      </Row>

      {schoolFilter != null ? (
        <Row>
          <Card className="w-100 mb-4">
            <CardBody>
              <Button
                close
                size="lg"
                className="mx-3"
                onClick={() => setSchoolFilter(null)}
              />
              <StaffTable
                data={data.filter((d) => d.nameOfInstitution === schoolFilter)}
              />
            </CardBody>
          </Card>
        </Row>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default AditionalRiskFactors;
