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
    return index === 5 ? 10 : 5;
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
        // console.log("new selected year: ", selectedVacancyYear);
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
  const [projectedElementaryVacancy, setProjectedElementaryVacancy] = useState(0);
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

        const groupByYear = (a) => {
          const years = ['2022', '2021', '2020', '2019', '2018'];
          // const years = ['2023', '2022', '2021', '2020', '2019', '2018'];
          let b = a.reduce((byGroup, vacancy) => {
            const { schoolYear } = vacancy;
            byGroup[schoolYear] = byGroup[schoolYear] ?? [];
            byGroup[schoolYear].push(vacancy);
            return byGroup;
          }, {});
          years.forEach(y =>  {
            if (!b.hasOwnProperty(y)) b[y] = [];
          });
          return b;
        }

        const getDataObject = (projectionData, borderColor, backgroundColor, schoolLevel = "All") => {
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

          let newProjectedVacancy = Math.round([
            vacancyCount.reduce(
              (total, count) => total + count,
              0 //add all years vacancies and stuff
            ) / vacancyCount.length, // divide it by all years count
          ]);
          var dataObject = vacancyCount.concat(newProjectedVacancy);
          switch (schoolLevel){
            case "EL":
              setProjectedElementaryVacancy(newProjectedVacancy);
              break;
            case "MS":
              setProjectedMiddleVacancy(newProjectedVacancy);
              break;
            case "HS":
              setProjectedHighVacancy(newProjectedVacancy);
              break;
            default:
              setProjectedVacancy(newProjectedVacancy);
              break;                
          }
          // console.log("projection vacancy", dataObject);

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
            if (response.results !== undefined) {
              console.log("thi is data: ", response.results);
              setData(response.results);
              setLineChartData(getDataObject(response.results, "rgb(255, 99, 132)", "rgba(255, 99, 132, 0.5)"));
              // setLineChartData(getDataObject(data));
              let elementarySchoolData = response.results.filter(v => v.schoolLevel == 'EL');
              setElementaryLineChartData(getDataObject(elementarySchoolData, "rgb(212, 125, 70)", "rgba(212, 125, 70, 0.5)", "EL"));
              let middleSchoolData = response.results.filter(v => v.schoolLevel == 'MS');
              setMiddleLineChartData(getDataObject(middleSchoolData, "rgb(91, 101, 145)", "rgba(91, 101, 145, 0.5)", "MS"));
              let highSchoolData = response.results.filter(v => v.schoolLevel == 'HS');
              setHighLineChartData(getDataObject(highSchoolData, "rgb(91, 101, 145)", "rgba(91, 101, 145, 0.5)", "HS"));
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
  };
}

export default UseVacancyReport;
