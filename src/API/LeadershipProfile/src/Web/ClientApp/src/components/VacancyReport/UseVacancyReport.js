// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect } from "react";

import config from "../../config";

function UseVacancyReport() {
  const { API_URL, API_CONFIG } = config();

  const [data, setData] = useState();
  const [retirementData, setRetirementData] = useState();
  const [selectedVacancyYear, setSelectedVacancyYear] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Principal");
  const [vacancyProjection, setVacancyProjection] = useState([]);
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(1);

  function customRadius(context) {
    let index = context.dataIndex;
    let value = context.dataset.data[index];
    return index === 5 ? 10 : 5;
  }

  const getLabels = (text = false, asc = false) => {
    var labels = [];
    var today = new Date();
    var pivotYear = today.getFullYear() +1;
    for (var i = 0; i < 6; i++) {
      text ? labels.push(pivotYear.toString()) : labels.push(pivotYear);
      pivotYear--;
    }
    return asc ? labels.reverse() : labels;
  }

  const [lineChartOptions, setLineChartOptions] = useState({
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
    onClick: function (evt, element) {
      if (element.length > 0 && element[0].index < 5) {
        setSelectedVacancyYear(element[0].index);
      }
    },
    elements: {
      point: {
        radius: customRadius,
        display: true,
      },
    },
    scales: {
      y: {
        ticks: {
          // precision: 0,
          beginAtZero: true,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
          stepSize: 1,
        },
      },
    },
  });
  var labels = getLabels(true, true);
  // console.log("labels", labels);
  const [lineChartData, setLineChartData] = useState({
    labels,
    datasets: [
      {
        label: "Vacancies",
        data: [3, 1, 3, 2, 7, 3],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [projectedVacancy, setProjectedVacancy] = useState(0);
  const [elementaryLineChartData, setElementaryLineChartData] = useState({
    labels,
    datasets: [
      {
        label: "Vacancies",
        data: [3, 1, 3, 2, 7, 3],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [projectedElementaryVacancy, setProjectedElementaryVacancy] =
    useState(0);
  const [middleLineChartData, setMiddleLineChartData] = useState({
    labels,
    datasets: [
      {
        label: "Vacancies",
        data: [3, 1, 3, 2, 7, 3],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [projectedMiddleVacancy, setProjectedMiddleVacancy] = useState(0);
  const [highLineChartData, setHighLineChartData] = useState({
    labels,
    datasets: [
      {
        label: "Vacancies",
        data: [3, 1, 3, 2, 7, 3],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [projectedHighVacancy, setProjectedHighVacancy] = useState(0);

  let defaultOrFilteredConfig = API_CONFIG("GET");

  function fetchData(role) {
    setData(null);
    let unmounted = false;
    // const apiUrl = new URL(API_URL + `vacancy/vacancyProjection`);
    const apiUrl = new URL(API_URL + `VacancyForecasts`);

    fetch(
      apiUrl,
      API_CONFIG(
        "POST",
        JSON.stringify({
          role: role,
        })
      )
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
          } else {
          }
          return;
        }

        const getDataObject = (
          projectionData,
          borderColor,
          backgroundColor,
          schoolLevel = "All"
        ) => {
          const years = [2024, 2023, 2022, 2021, 2020];

          let totalVacancies = 0;
          const vacancyCount = projectionData
            .filter(
              (d) => schoolLevel === "All" || d.schoolLevel === schoolLevel
            )
            .reduce((acc, cur) => {
              totalVacancies = 1 + totalVacancies;
              acc[cur.schoolYear] = 1 + (acc[cur.schoolYear] ?? 0);
              return acc;
            }, Object.create(null));

          let newProjectedVacancy = Math.round([
            totalVacancies / years.length, // divide it by all years count
          ]);

          const vacancyCountList = years
            .sort((a, b) => a - b)
            .map((y) => vacancyCount[y] ?? 0);
          var dataObject = vacancyCountList.concat(newProjectedVacancy);

          switch (schoolLevel) {
            case "Elementary School":
              setProjectedElementaryVacancy(newProjectedVacancy);
              break;
            case "Middle School":
              setProjectedMiddleVacancy(newProjectedVacancy);
              break;
            case "High School":
              setProjectedHighVacancy(newProjectedVacancy);
              break;
            default:
              setProjectedVacancy(newProjectedVacancy);
              break;
          }

          return {
            labels,
            datasets: [
              {
                label: "Vacancies",
                data: dataObject,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
              },
            ],
          };
        };

        response.json().then((response) => {
          if (!unmounted && response !== null) {
            if (response !== undefined) {
              setData(response);
              setLineChartData(
                getDataObject(
                  response,
                  "rgb(255, 99, 132)",
                  "rgba(255, 99, 132, 0.5)"
                )
              );
              // setLineChartData(getDataObject(data));
              let elementarySchoolData = response.filter(
                (v) => v.schoolLevel == "Elementary School"
              );
              setElementaryLineChartData(
                getDataObject(
                  elementarySchoolData,
                  "rgb(212, 125, 70)",
                  "rgba(212, 125, 70, 0.5)",
                  "Elementary School"
                )
              );
              let middleSchoolData = response.filter(
                (v) => v.schoolLevel == "Middle School"
              );
              setMiddleLineChartData(
                getDataObject(
                  middleSchoolData,
                  "rgb(91, 101, 145)",
                  "rgba(91, 101, 145, 0.5)",
                  "Middle School"
                )
              );
              let highSchoolData = response.filter(
                (v) => v.schoolLevel == "High School"
              );
              setHighLineChartData(
                getDataObject(
                  highSchoolData,
                  "rgb(91, 101, 145)",
                  "rgba(91, 101, 145, 0.5)",
                  "High School"
                )
              );
            }
          }
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  useEffect(() => {
    fetchData(selectedRole);
  }, []);



  return {
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
    retirementData,
    setRetirementData,
  };
}

export default UseVacancyReport;
