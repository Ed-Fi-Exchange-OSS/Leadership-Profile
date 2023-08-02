import { useState } from "react";
import { Col, Row } from "reactstrap";
import { Tooltip } from "reactstrap";
import UseAditionalRiskFactors from "./UseAditionalRiskFactors";


const AditionalRiskFactors = ({ data, selectedRole }) => {

  const { 
    vacancyRateData,
    eligibleForRetirementData,
    eligibleForRetirementNowCount,
    eligibleForRetirementSoonCount,
    currentPerformanceData,
    scoreCount
  } = UseAditionalRiskFactors(data) ?? {};

  const getReasonColor = (reason) => {
    var color = "";
    switch (reason) {
      case 'Attrition': 
        color = 'orange';
        break;
      case 'Retirement': 
        color = 'brown';
        break;
      case 'Internal Transfer': 
        color = 'pink';
        break;
      case 'Internal Promotion': 
        color = 'green';
        break;
      case 'Finished Year': 
        color = 'purple';
        break;
      default:
        color = "white";
        break;
    };
    return color;
  }

  const [hoveredVacancy, setHoveredVacancy] = useState(null);
  const [hoveredEligible, setHoveredEligible] = useState(null);
  const [hoveredPerformance, setHoveredPerformance] = useState(null);

  return (
    <Row>
      <Col md="12" className="mb-2">
        <h3 className="fw-bold">
          What additional risk factors impact vacancies?
        </h3>
      </Col>
      <Col md="6" className="mt-3">
        <h5 className="color left-title">
          <span className="color orange-bold-text mr-1">
            {selectedRole == "Principal" ? 20 : 35} %
          </span>
          {/* Average { selectedRole } */}
          Turnover 5 years
        </h5>
        <h5 className="left-title">5-Year Vacancy Rate</h5>
        <Row className="my-3 retirement-max-height">
          <Col>
            {vacancyRateData
              ? vacancyRateData.map((school, i) => (
                  <Row key={'risk-factor-recor-' + i}>
                    <Col md="8">{school.name}</Col>
                    <Col md="1">{school.vacancy.length}</Col>
                    <Col md="3">
                      <Row>
                        {school.vacancy.map((vacancy, j) => (
                          <div
                            key={'vacancy-risk-factor-element-' + i + '-' + j}
                            id={'vacancy-risk-factor-element-' + i + '-' + j}
                            onMouseEnter={() => setHoveredVacancy('vacancy-risk-factor-element-' + i + '-' + j)}
                            onMouseLeave={() => setHoveredVacancy(null)}
                          >
                            <div
                              
                              style={{
                                marginLeft: "3px",
                                marginRight: "3px",
                                width: "20px",
                                height: "20px",
                                border: "solid 1px",
                              }}
                              className={getReasonColor(vacancy.vacancyCause)}                              
                            ></div>
                            <Tooltip 
                              target={'vacancy-risk-factor-element-' + i + '-' + j} 
                              isOpen={hoveredVacancy && hoveredVacancy == 'vacancy-risk-factor-element-' + i + '-' + j}
                            >
                              <p>
                                Name: {vacancy.fullNameAnnon} <br/>
                                Year: {vacancy.schoolYear} <br/>
                                Reason: {vacancy.vacancyCause}</p>
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
        <h5 className="left-title gray-bold-text">{ selectedRole ?? ""} Eligibility for Retirement</h5>
        <Row className="my-3 retirement-max-height">
          <Col>
            {eligibleForRetirementData
              ? eligibleForRetirementData.map((school, i) => (
                  <Row key={'eligible-for-retirement-' + i}>
                    <Col md="8">{school.schoolName}</Col>
                    <Col md="4">
                      <Row>
                        { school.eligibles.map((eligible, j) => (
                          <div                          
                            id={'eligible-for-retirement-' + i + '-' + j}
                            onMouseEnter={() => setHoveredEligible('eligible-for-retirement-' + i + '-' + j)}
                            onMouseLeave={() => setHoveredEligible(null)}
                            // className="eligible-for-retirement"
                          >
                            <div 
                              className={'circle color-circle-' + (Number(eligible.retElig) == 0 ? 4 : 3)}
                            ></div>
                            <Tooltip 
                              target={'eligible-for-retirement-' + i + '-' + j}
                              isOpen={hoveredEligible && hoveredEligible == 'eligible-for-retirement-' + i + '-' + j}                              
                            >
                              {eligible.fullNameAnnon}
                            </Tooltip>
                          </div>
                        )) }
                      </Row>
                    </Col>
                  </Row>
                ))
              : ""}
          </Col>
        </Row>
        <h6 className="left-title blue-bold-text">{eligibleForRetirementNowCount ? eligibleForRetirementNowCount : 0} Eligible Now</h6>
        <h6 className="left-title gray-bold-text">{eligibleForRetirementSoonCount ? eligibleForRetirementSoonCount : 0} Eligible in 1-2 Years</h6>
      </Col>
      <Col md="3" className="mt-3">
        {/* <h5 className="color left-title">
          <span className="color green-bold-text mr-1">
            {" "}
            {currentPerformanceData ? currentPerformanceData.length : 0}{" "}
          </span>
          { selectedRole + "s" ?? "" }
        </h5> */}
        <h5 className="left-title green-bold-text">Current {selectedRole} Performance</h5>
        <Row className="my-3 retirement-max-height">
          <Col>
            {currentPerformanceData
              ? currentPerformanceData.map((performance, i) => (
                  <Row key={'performance-record-' + i}>
                    <Col md="8">{performance.name}</Col>
                    <Col md="4">
                      <Row>
                        {performance.staff.map((staff, j) => (
                          <div
                            key={'performance-staff-' + i + '-' + j}
                            id={'performance-staff-' + i + '-' + j}
                            onMouseEnter={() => setHoveredPerformance('performance-staff-' + i + '-' + j)}
                            onMouseLeave={() => setHoveredPerformance(null)}
                          >
                            <div
                              // className="green-circle"
                              className={'circle color-circle-' + Math.round(staff.overallScore)}
                            ></div>
                            <Tooltip
                              target={'performance-staff-' + i + '-' + j}
                              isOpen={hoveredPerformance && hoveredPerformance == 'performance-staff-' + i + '-' + j}
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
        </Row>
        {/* <p className="m-0 p-0 left-title soft-orange-bold-text"> */}
        <Row className="m-0 p-0 left-title soft-orange-bold-text">
          <Col md={1}>
            {scoreCount ? scoreCount[0] : 0} 
          </Col>
          <Col md={8}>
            at Overall Score 1
          </Col>          
        {/* </p> */}
        </Row>
        <Row className="m-0 p-0 left-title soft-yellow-bold-text">
          <Col md={1}>
            {scoreCount ? scoreCount[1] : 0} 
          </Col>
          <Col md={10}>
            at Overall Score 2
          </Col>          
        {/* </p> */}
        </Row>
        <Row className="m-0 p-0 left-title gray-bold-text">
          <Col md={1}>
            {scoreCount ? scoreCount[2] : 0} 
          </Col>
          <Col md={10}>
            at Overall Score 3
          </Col>          
        {/* </p> */}
        </Row>
        <Row className="m-0 p-0 left-title soft-blue-bold-text">
          <Col md={1}>
            {scoreCount ? scoreCount[3] : 0} 
          </Col>
          <Col md={10}>
            at Overall Score 4
          </Col>          
        {/* </p> */}
        </Row>
        <Row className="m-0 p-0 left-title soft-green-bold-text">
          <Col md={1}>
            {scoreCount ? scoreCount[4] : 0} 
          </Col>
          <Col md={10}>
            at Overall Score 5
          </Col>          
        {/* </p> */}
        </Row>
        {/* <p className="m-0 p-0 left-title soft-orange-bold-text">{scoreCount ? scoreCount[0] : 0} at Overall Score 1</p> */}
        {/* <p className="m-0 p-0 left-title soft-yellow-bold-text">{scoreCount ? scoreCount[1] : 0} at Overall Score 2</p>
        <p className="m-0 p-0 left-title gray-bold-text">{scoreCount ? scoreCount[2] : 0} at Overall Score 3</p>
        <p className="m-0 p-0 left-title soft-blue-bold-text">{scoreCount ? scoreCount[3] : 0} at Overall Score 4</p>
        <p className="m-0 p-0 left-title soft-green-bold-text">{scoreCount ? scoreCount[4] : 0} at Overall Score 5</p> */}
      </Col>
    </Row>
  );
};

export default AditionalRiskFactors;
