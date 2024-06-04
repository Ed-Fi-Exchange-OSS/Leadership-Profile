// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import UserSchoolCategoryCharts from './UseSchoolCategoryCharts'


const SchoolCategoryCharts = () => {

    const {
        selectedVacancyYear, setSelectedVacancyYear,
        vacancyProjection, setVacancyProjection,
        selectedSchoolLevel, setSelectedSchoolLevel
     } = UserSchoolCategoryCharts();

    return (
        <div className="row my-4">
          <div
            className="col-md-4"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedSchoolLevel(1) }
          >
            <div
              className={
                selectedSchoolLevel == 1 ? "card p-3 yellow-border" : 
                "card p-3"
              }
            >
              <div className="card-body">
                <div className="row">
                  <h5 className="color left-title">
                    All campuses
                  </h5>
                  <h5 className="color left-title">
                    5-Year Average:{" "}
                    <span className="color bold-text yellow-color mr-1">
                      {/* {projectedVacancy} Projected Vacancies */}
                    </span>
                  </h5>
                </div>
                <div className="row">
                  {/* <Line options={lineChartOptions} data={lineChartData} /> */}
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
                      : 
                      "card p-3"
                  }
                >
                  <div className="card-body">
                    <div className="row">
                      <h5 className="color left-title">
                        Elementary School
                      </h5>
                      <h5 className="color left-title">
                        5-Year Average:{" "}
                        <span className="color bold-text yellow-color mr-1">
                          {/* {projectedElementaryVacancy} Projected Vacancies */}
                        </span>
                      </h5>
                    </div>
                    <div className="row">
                      {/* <Line
                        options={lineChartOptions}
                        data={elementaryLineChartData}
                      /> */}
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
                      : 
                      "card p-3"
                  }
                >
                  <div className="card-body">
                    <div className="row">
                      <h5 className="color left-title">Middle School</h5>
                      <h5 className="color left-title">
                        5-Year Average:{" "}
                        <span className="color bold-text yellow-color mr-1">
                          {/* {projectedMiddleVacancy} Projected Vacancies */}
                        </span>
                      </h5>
                    </div>
                    <div className="row">
                      {/* <Line
                        options={lineChartOptions}
                        data={middleLineChartData}
                      /> */}
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
                      : 
                      "card p-3"
                  }
                >
                  <div className="card-body">
                    <div className="row">
                      <h5 className="color left-title">High School</h5>
                      <h5 className="color left-title">
                        5-Year Average:{" "}
                        <span className="color bold-text yellow-color mr-1">
                          {/* {projectedHighVacancy}  */}
                          Projected Vacancies
                        </span>
                      </h5>
                    </div>
                    <div className="row">
                      {/* <Line
                        options={lineChartOptions}
                        data={highLineChartData}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default SchoolCategoryCharts;