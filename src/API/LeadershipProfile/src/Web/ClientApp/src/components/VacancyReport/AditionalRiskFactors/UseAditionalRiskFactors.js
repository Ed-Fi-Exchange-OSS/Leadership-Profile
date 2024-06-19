// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect } from "react";

import config from "../../../config";

function UseAditionalRiskFactors(data, selectedRole) {
  const { API_URL, API_CONFIG } = config();

  const [vacancyRateData, setVacancyRateData] = useState(null);
  const [eligibleForRetirementData, setEligibleForRetirementData] =
    useState(null);
  const [eligibleForRetirementNowCount, setEligibleForRetirementNowCount] =
    useState(null);
  const [eligibleForRetirementSoonCount, setEligibleForRetirementSoonCount] =
    useState(null);
  const [currentPerformanceData, setCurrentPerformanceData] = useState(null);
  const [scoreCount, setScoreCount] = useState(null);
  const [activeStaffData, setActiveStaffData] = useState(null);
  const [turnoverPercent, setTurnoverPercent] = useState(0);

  useEffect(() => {
    const apiUrl = new URL(API_URL + `VacancyForecasts`);

    fetch(
      apiUrl,
      API_CONFIG(
        // "GET"
        "POST",
        JSON.stringify({
          role: selectedRole,
        })
      )
    ).then((response) => {
      response.json().then((json) => {
        var data = json;
        const groupByProp = (a, prop) =>
          a.reduce((byProp, vacancy) => {
            const vacancyProp = vacancy[prop];
            byProp[vacancyProp] = byProp[vacancyProp] ?? [];
            byProp[vacancyProp].push(vacancy);
            return byProp;
          }, []);

        const vacancyGroupedBySchool = groupByProp(data, "nameOfInstitution");
        var schoolsArray = [];
        for (const key in vacancyGroupedBySchool) {
          if (vacancyGroupedBySchool.hasOwnProperty(key)) {
            schoolsArray.push({
              name: key,
              vacancy: vacancyGroupedBySchool[key],
            });
          }
        }
        schoolsArray = schoolsArray.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (b.name > a.name) {
            return -1;
          }
          return 0;
        });

        setVacancyRateData(schoolsArray);

      });
    });
  }, []);

  useEffect(() => {
    getActiveStaff();
  }, []);

  const getActiveStaff = function () {
    const apiUrl = new URL(API_URL + 'VacancyForecasts/ActiveStaff');

    fetch(
      apiUrl,
      API_CONFIG(
        // "GET"
        "POST",
        JSON.stringify({
          role: selectedRole,
        })
      )
    ).then((response) => {
      response.json().then((activeStaff) => {

          var scoreC = [
            activeStaff.filter((s) => Math.round(s.rating) == 1).length,
            activeStaff.filter((s) => Math.round(s.rating) == 2).length,
            activeStaff.filter((s) => Math.round(s.rating) == 3).length,
            activeStaff.filter((s) => Math.round(s.rating) == 4).length,
            activeStaff.filter((s) => Math.round(s.rating) == 5).length,
          ];
  
          setScoreCount(scoreC);
          setEligibleForRetirementNowCount(
            activeStaff.filter((s) => s.retirementEligibility).length
          );
          setEligibleForRetirementSoonCount(
            // Math.round((thisYearData.filter((s) => !s.retElig).length) * 0.3)
            activeStaff.filter((s) => !s.retirementEligibility && s.yearsToRetirement > 0 && s.yearsToRetirement <= 2).length          
          );

        // var schools = {};
        var groupBy = function(xs, key) {
          return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        var grouped = groupBy(activeStaff, "nameOfInstitution");
        console.log("grouped");
        console.log(grouped);

        setActiveStaffData(grouped);
        console.log("ActiveData");
        console.log(activeStaffData);

      })
    })    
  };

  return {
    vacancyRateData,
    eligibleForRetirementData,
    eligibleForRetirementNowCount,
    eligibleForRetirementSoonCount,
    currentPerformanceData,
    scoreCount,
    activeStaffData,
    turnoverPercent
  };
}

export default UseAditionalRiskFactors;
