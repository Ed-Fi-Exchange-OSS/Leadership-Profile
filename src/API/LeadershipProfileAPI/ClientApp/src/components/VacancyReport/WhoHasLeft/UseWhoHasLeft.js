import { useState, useEffect } from "react";

function UseWhoHasLeft(data) {    
    const [ whoHasLeftData, setWhoHasLeftData] = useState(null);
    const [ pieChartData, setPieChartData] = useState(null);
    const [ raceChartData, setRaceChartData] = useState(null);
    const [ genderChartData, setGenderChartData] = useState(null);
    const [ mainNumber, setMainNumber] = useState(0);
    const [ mainReason, setMainReason] = useState("");
    
    // var races = [
    //   "Other",
    //   "Black of Afr. American",
    //   "Asian",
    //   "White",
    //   "Hispanic or Latino",
    // ];
    const causes = [
      "Attrition",
      "Retirement",
      "Internal Transfer",
      "Internal Promotion",
      // "Finished year"      
    ];
    var races = [
      "2orMore",
      "Asian",
      "African American",
      "White",
      "Hispanic",
    ];
    const genders = ["M", "F"];
   
    useEffect(() => {
  
      const groupByCause = (a) =>
            a.reduce((byGroup, vacancy) => {
              const { vacancyCause } = vacancy;
              byGroup[vacancyCause] = byGroup[vacancyCause] ?? [];
              byGroup[vacancyCause].push(vacancy);
              return byGroup;
            }, {});
      const groupByProp = (a, prop) =>
            a.reduce((byProp, vacancy) => {
              const vacancyProp = vacancy[prop];
              byProp[vacancyProp] = byProp[vacancyProp] ?? [];
              byProp[vacancyProp].push(vacancy);
              return byProp;
            }, {});
  
      const vacancyGroupedByCause = groupByCause(data);
      var pieChartCount = [];
      var results = [0, ""];
      causes.forEach(item => {
        if (vacancyGroupedByCause[item].length > results[0]) {
          results[0]= vacancyGroupedByCause[item].length;
          results[1] = item;
        }
      });
      setMainNumber(results[0]);
      setMainReason(results[1]);
      causes.forEach(c => pieChartCount.push(vacancyGroupedByCause[c] ? vacancyGroupedByCause[c].length : 0));
      setPieChartData({
        labels: causes,
        datasets: [
          {
            label: "",
            data: pieChartCount,
            backgroundColor: [
              "rgba(212, 125,70, 0.25)",
              "rgba(123, 109, 104, 0.25)",
              "rgba(237, 228, 218, 0.5)",
              "rgba(208, 222, 187, 0.5)"
            ],
            borderColor: [
              "rgba(212, 125,70, 1)",
              "rgba(123, 109, 104, 1)",
              "rgba(237, 228, 218, 1)",
              "rgba(208, 222, 187, 1)"
            ],
            borderWidth: 1,
          },
        ],
      });

      const vacancyGroupedByRace = groupByProp(data, "race");
      var raceChartCount = [];
      races.forEach(c => raceChartCount.push(vacancyGroupedByRace[c] ? vacancyGroupedByRace[c].length : 0));
      setRaceChartData({
        labels: races,
        datasets: [
          {
            label: "Male",
            data: [1, 4, 2, 5, 7],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Female",
            data: raceChartCount,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },          
        ],
      });

      const vacancyGroupedByGender = groupByProp(data, "gender");
      var genderChartCount = [];
      genders.forEach(c => genderChartCount.push(vacancyGroupedByGender[c] ? vacancyGroupedByGender[c].length : 0));
      setGenderChartData({
        labels: genders,
        datasets: [
          {
            label: "",
            data: genderChartCount,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "",
            data: [1, 4, 2, 5, 7],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });

    }, []);


    return {
      pieChartData,
      raceChartData,
      genderChartData,
      mainNumber,
      mainReason
    };

}

export default UseWhoHasLeft;