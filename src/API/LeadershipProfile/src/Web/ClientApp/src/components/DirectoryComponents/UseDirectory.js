// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import config from "../../config";
import LogoutService from "../../utils/logout-service";

function UseDirectory() {
  const navigate = useNavigate();
  // const history = useHistory();
  const location = useLocation();
  const { API_URL, API_CONFIG } = config();
  const { logout } = LogoutService();

  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState();

  const [url, setUrl] = useState(window.location.href);
  const searchableUrl = useRef(new URL(url));

  const buttonRef = useRef();

  const [sort, setSort] = useState({
    category:
      searchableUrl.current.searchParams.get("sortField") !== null &&
      searchableUrl.current.searchParams.get("sortField") !== "null"
        ? searchableUrl.current.searchParams.get("sortField")
        : "id",
    value:
      searchableUrl.current.searchParams.get("sortBy") !== null &&
      searchableUrl.current.searchParams.get("sortBy") !== "null"
        ? searchableUrl.current.searchParams.get("sortBy")
        : "asc",
  });

  const [paging, setPaging] = useState({
    page:
      searchableUrl.current.searchParams.get("page") !== null &&
      searchableUrl.current.searchParams.get("page") !== "null"
        ? searchableUrl.current.searchParams.get("page")
        : 1,
    totalSize: 0,
    maxPages: 1,
  });

  useEffect(() => {
    if (
      // history.action === "POP" &&
      searchableUrl.current.search !== location.search
    ) {
      const searchParams = new URLSearchParams(location.search);
      setPaging({ ...paging, page: searchParams.get("page") });
      setSort({
        category: searchParams.get("sortField"),
        value: searchParams.get("sortBy"),
      });
    }
  }, ["POP", location]);
  // }, [history.action, history.location]);

  useEffect(() => {
    searchableUrl.current.textContent = new URL(url);
    const params = Array.from(searchableUrl.current.searchParams);
    params.forEach((param) =>
      searchableUrl.current.searchParams.delete(param[0])
    );
    searchableUrl.current.searchParams.set("page", paging.page);
    searchableUrl.current.searchParams.set("sortField", sort.category);
    searchableUrl.current.searchParams.set("sortBy", sort.value);
    searchableUrl.current.searchParams.sort();
    setUrl(searchableUrl.current.href);
  }, [sort, paging.page]);

  useEffect(() => {
    searchableUrl.current.textContent = new URL(url);
    if (
      searchableUrl.current.search === location.search ||
      !searchableUrl.current.search
    )
      return;
    navigate(`${searchableUrl.current.search}`);
  }, [url]);

  useEffect(() => {
    console.log("Searching...");
    if (filters !== undefined) {
      let defaultOrFilteredConfig =
        filters !== undefined
          ? API_CONFIG(
              "POST",
              JSON.stringify({
                page: searchableUrl.current.searchParams.get("page"),
                sortField: searchableUrl.current.searchParams.get("sortField"),
                sortBy: searchableUrl.current.searchParams.get("sortBy"),
                searchRequestBody: filters,
              })
            )
          : API_CONFIG("GET");
      if (!searchableUrl.current.search) return;
      let unmounted = false;
      const apiUrl = new URL(API_URL + `search${location.search}`);
      if (paging.page !== 0)
        fetch(apiUrl + "&OnlyActive=true", defaultOrFilteredConfig)
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
                setPaging({
                  ...paging,
                  totalSize: response.totalCount,
                  maxPages: Math.ceil(response.totalCount / 10),
                  page:
                    Math.ceil(response.totalCount / 10) >= paging.page
                      ? paging.page
                      : 1,
                });
              }
            });
          })
          .catch((error) => {
            setError(true);
            console.error(error.message);
          });
      return () => {
        unmounted = true;
      };
    }
  }, [filters, url]);

  function setPage(newPage) {
    setPaging({
      ...paging,
      page: newPage,
    });
  }

  function setColumnSort(category, value) {
    setSort({ category, value });
  }

  function exportResults() {
    console.log("Searching...");
    let defaultOrFilteredConfig =
      filters !== undefined
        ? API_CONFIG(
            "POST",
            JSON.stringify({
              page: searchableUrl.current.searchParams.get("page"),
              sortField: searchableUrl.current.searchParams.get("sortField"),
              sortBy: searchableUrl.current.searchParams.get("sortBy"),
              searchRequestBody: filters,
            })
          )
        : API_CONFIG("GET");
    if (!searchableUrl.current.search) return;
    let unmounted = false;
    let search = location.search;
    const apiUrl = new URL(
      API_URL +
        `search${search.substr(0, 6) + "0" + search.substr(7, search.length)}`
    );
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
              setExportData(response.results);
              console.log("Button", buttonRef);
              buttonRef.current.click();
            }
          }
        });
      })
      .catch((error) => {
        setError(true);
        console.error(error.message);
      });
  }

  return {
    setColumnSort,
    setSort,
    sort,
    data,
    exportData,
    paging,
    setPage,
    error,
    setFilters,
    exportResults,
    buttonRef,
  };
}

export default UseDirectory;
