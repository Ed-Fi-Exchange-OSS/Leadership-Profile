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
      // const apiUrl = new URL(API_URL + `vacancy/identifyLeaders`);
      const apiUrl = new URL(API_URL + `leaders-search`);

      fetch(apiUrl, API_CONFIG("POST", JSON.stringify({
        // role: "principal",
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
            if (response.results !== undefined) {
              setData(response.results);
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

      fetchData({roles: [1, 2]})

    }, []);

    return {
        data,
        fetchData
    };

}

export default UseIdentifyLeaders;
