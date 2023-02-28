import { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";

import config from "../../../config";
import LogoutService from "../../../utils/logout-service";

function UseLeadersTable() {
  const history = useHistory();
  const location = useLocation();
  const { API_URL, API_CONFIG } = config();
  const { logout } = LogoutService();

  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [error, setError] = useState(false);


  useEffect(() => {
      console.log("Searching...");
    let defaultOrFilteredConfig =
      
      API_CONFIG("GET");
    // if (!searchableUrl.current.search) return;
    let unmounted = false;
    const apiUrl = new URL(API_URL + `search${history.location.search}`);
    // if (paging.page !== 0)
      fetch(apiUrl, defaultOrFilteredConfig)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              logout();
            } else {
              setError(true);
            }
            return;
          }

          setError(false);

          response.json().then((response) => {
            if (!unmounted && response !== null) {
              if (response.results !== undefined) {
                setData(response.results);
              }
            }
          });
        })
        .catch((error) => {
          setError(true);
          console.error(error.message);
        });
  });

  return {
    data,
    exportData,
    error,
  };
}

export default UseLeadersTable;
