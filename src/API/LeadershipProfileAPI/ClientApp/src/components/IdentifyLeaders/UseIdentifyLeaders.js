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