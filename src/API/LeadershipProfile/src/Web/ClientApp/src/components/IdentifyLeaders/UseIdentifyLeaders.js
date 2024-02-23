// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect } from "react";

import config from "../../config";


function UseIdentifyLeaders() {

    const { API_URL, API_CONFIG } = config();

    const [data, setData] = useState([]);

    const fetchData = (filters) => {
      let unmounted = false;
      const apiUrl = new URL(API_URL + `IdentifyLeaders`);

      fetch(apiUrl, API_CONFIG("POST", JSON.stringify({
        ...filters
      })))
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {

          } else {

          }
          return;
        }

        response.json().then((response) => {
          if (!unmounted && response !== null) {
            if (response !== undefined) {
              setData(response);
              console.log("items:", response)
              // lineChartData1.data = response.results.projectionData1;
            }
          }
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
    }

    useEffect(() => {

      
      var payload = JSON.parse(
        '{"roles":[3,4,2,1],"schoolLevels":[1,2,3],"highestDegrees":[1,2,3],"hasCertification":[1,2],"yearsOfExperience":[1,2],"overallScore":["0","5"],"domainOneScore":["0","5"],"domainTwoScore":["0","5"],"domainThreeScore":["0","5"],"domainFourScore":["0","5"],"domainFiveScore":["0","5"]}'
      );

      fetchData(payload)

    }, []);

    return {
        data,
        fetchData
    };

}

export default UseIdentifyLeaders;
