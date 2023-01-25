import { useState, useEffect } from "react";

import config from "../../config";

function UseVacancyReport() {
  const { API_URL, API_CONFIG } = config();

  const [data, setData] = useState();
  const [selectedVacancyYear, setSelectedVacancyYear] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Principal");
  const [vacancyProjection, setVacancyProjection] = useState([]);
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(1);

  function customRadius(context) {
    let index = context.dataIndex;
    let value = context.dataset.data[index];
    return index === 5 ? 10 : 2;
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
        console.log(element, element[0].index);
        setSelectedVacancyYear(element[0].index);
        console.log("new selected year: ", selectedVacancyYear);
        // element,element[0]._datasetInde[]
        // you can also get dataset of your selected element
        // console.log(data.datasets[element[0]._datasetIndex])
      }
    },
    elements: {
      point: {
        radius: customRadius,
        display: true,
      },
    },
  });
  const labels = ["2018", "2019", "2020", "2021", "2022", "2023"];
  const [lineChartData1, setLineChartData1] = useState({
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

  let defaultOrFilteredConfig = API_CONFIG("GET");

  function fetchData(role) {
    setData(null)
    let unmounted = false;
    // const apiUrl = new URL(API_URL + `vacancy/vacancyProjection`);
    const apiUrl = new URL(API_URL + `vacancy/vacancy-projection`);

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

        const groupByYear = (a) =>
          a.reduce((byGroup, vacancy) => {
            const { schoolYear } = vacancy;
            byGroup[schoolYear] = byGroup[schoolYear] ?? [];
            byGroup[schoolYear].push(vacancy);
            return byGroup;
          }, {});

        const getDataObject = (projectionData) => {
          var vacancyByYear = groupByYear(projectionData);
          // console.log("vacancy by year:", vacancyByYear);

          var vacancyCount = [];

          for (var key in vacancyByYear) {
            if (
              vacancyByYear.hasOwnProperty(key) &&
              Array.isArray(vacancyByYear[key])
            ) {
              var count = vacancyByYear[key].length;
              vacancyCount.push(count);
            }
          }

          setProjectedVacancy(Math.round([
            vacancyCount.reduce(
              (total, count) => total + count,
              0 //add all years vacancies and stuff
            ) / vacancyCount.length, // divide it by all years count
          ]));
          var dataObject = vacancyCount.concat(
            Math.round([
              vacancyCount.reduce(
                (total, count) => total + count,
                0 //add all years vacancies and stuff
              ) / vacancyCount.length, // divide it by all years count
            ])
          );
          // console.log("projection vacancy", dataObject);

          return {
            labels,
            datasets: [
              {
                label: "Vacancies",
                data: dataObject,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          };
        };

        response.json().then((response) => {
          if (!unmounted && response !== null) {
            if (response.results !== undefined) {
              console.log("thi is data: ", response.results);
              setData(response.results);
              setLineChartData1(getDataObject(response.results));
              // setLineChartData2(getDataObejct(response.results.projectionData1));
              // setLineChartData3(getDataObejct(response.results.projectionData1));
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
    lineChartData1,
    projectedVacancy,
    lineChartOptions,
    selectedSchoolLevel,
    setSelectedSchoolLevel,    
  };
}

export default UseVacancyReport;
