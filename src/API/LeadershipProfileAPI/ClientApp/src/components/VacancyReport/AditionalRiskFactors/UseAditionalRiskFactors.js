import { useState, useEffect } from "react";

function UseAditionalRiskFactors(data) {    
    const [ vacancyRateData, setVacancyRateData] = useState(null);
    const [ eligibleForRetirementData, setEligibleForRetirementData] = useState(null);
    const [ currentPerformanceData, setCurrentPerformanceData] = useState(null);
    
    
    const causes = [
      "Attrition",
      "Retirement",
      "Internal Transfer",
      "Internal Promotion",
      // "Finished year"      
    ];
    var races = [
      "2orMore",
      "A",
      "AA",
      "W",
      "H",
    ];
    const genders = ["M", "F"];
   
    useEffect(() => {
  
      const groupByProp = (a, prop) =>
            a.reduce((byProp, vacancy) => {
              const vacancyProp = vacancy[prop];
              byProp[vacancyProp] = byProp[vacancyProp] ?? [];
              byProp[vacancyProp].push(vacancy);
              return byProp;
            }, []);
  
      const vacancyGroupedBySchool = groupByProp(data, "schoolNameAnnon");
      var schoolsArray = [];
      for (const key in vacancyGroupedBySchool) {
        if (vacancyGroupedBySchool.hasOwnProperty(key)) {
          schoolsArray.push({
            name: key,
            vacancy: vacancyGroupedBySchool[key]
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


      // var staffEligibleForRetirement = data.filter(d => d.retElig == 0);
      var staffEligibleForRetirement = schoolsArray.map(school => {
        let newSchool = {
          schoolName: school.name,
          eligibles: school.vacancy.filter(v => v.retElig == 0)
        };
        return newSchool;
      }).filter(ns => ns.eligibles.length);
      setEligibleForRetirementData(staffEligibleForRetirement);

      // var staffEligibleForRetirement = data.filter(d => d.retElig == 0);
      var staffPerformance = schoolsArray.map(school => {
        let newSchool = {
          name: school.name,
          staff: school.vacancy.filter(v => v.retElig == 0)
        };
        return newSchool;
      }).filter(ns => ns.staff.length);
      setCurrentPerformanceData(staffPerformance);


    }, []);


    return {
      vacancyRateData,
      eligibleForRetirementData,
      currentPerformanceData,
    };

}

export default UseAditionalRiskFactors;