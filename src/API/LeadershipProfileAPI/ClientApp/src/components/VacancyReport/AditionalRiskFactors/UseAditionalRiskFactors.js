import { useState, useEffect } from "react";

function UseAditionalRiskFactors(data) {    
    const [ vacancyRateData, setVacancyRateData] = useState(null);
    const [ eligibleForRetirementData, setEligibleForRetirementData] = useState(null);
    const [ eligibleForRetirementNowCount, setEligibleForRetirementNowCount] = useState(null);
    const [ eligibleForRetirementSoonCount, setEligibleForRetirementSoonCount] = useState(null);
    const [ currentPerformanceData, setCurrentPerformanceData] = useState(null);
    const [ scoreCount, setScoreCount ] = useState(null);
    
    
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

      var scoreC = [
        data.filter(s => Math.round(s.overallScore) == 1).length,
        data.filter(s => Math.round(s.overallScore) == 2).length,
        data.filter(s => Math.round(s.overallScore) == 3).length,
        data.filter(s => Math.round(s.overallScore) == 4).length,
        data.filter(s => Math.round(s.overallScore) == 5).length
      ]

      setScoreCount(scoreC);

      /**
       * Count staff sligible for retirement now or soon (1-2 years).
       */
      setEligibleForRetirementNowCount(data.filter(s => s.retElig == 0).length);
      setEligibleForRetirementSoonCount(data.filter(s => [1, 2].includes(Number(s.retElig))).length);

      /**
       * 
       */
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


      var staffEligibleForRetirement = schoolsArray.map(school => {
        return {
          schoolName: school.name,
          eligibles: school.vacancy.filter(v => [0, 1, 2].includes(Number(v.retElig)))
        };
      }).filter(ns => ns.eligibles.length);
      setEligibleForRetirementData(staffEligibleForRetirement);


      var staffPerformance = schoolsArray.map(school => {
        let newSchool = {
          name: school.name,
          // staff: school.vacancy.filter(v => v.retElig == 0)
          staff: school.vacancy
        };
        return newSchool;
      }).filter(ns => ns.staff.length);
      setCurrentPerformanceData(staffPerformance);

    }, []);


    return {
      vacancyRateData,
      eligibleForRetirementData,
      eligibleForRetirementNowCount,
      eligibleForRetirementSoonCount,
      currentPerformanceData,
      scoreCount
    };

}

export default UseAditionalRiskFactors;