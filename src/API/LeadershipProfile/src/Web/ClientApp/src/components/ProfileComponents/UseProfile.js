// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect } from 'react';
import config from '../../config';

function UseProfile(id) {

    const GISD_RATING = [
        {
          title: "Overall",
          ratingsByYear: {
            2022: [
              {
                category: "Domain 1: Grow Leaders",
                score: 3
              },
              {
                category: "Domain 2: Inspire Innovation",
                score: 2.75
              },
              {
                category: "Domain 3: Strive for Excellence",
                score: 3.5
              },
              {
                category: "Domain 4: Develop Relationships",
                score: 3
              }
            ]
          }
        },
        {
          title: "Domain 1: Grow Leaders",
          ratingsByYear: {
            2022: [
              {
                category: "Indicator 1.1: Ethics and Standards",
                score: 3
              },
              {
                category: "Indicator 1.2: Schedules for Core Leadership Tasks",
                score: 3
              },
              {
                category: "Indicator 1.3: Strategic Planning",
                score: 3
              },
              {
                category: "Indicator 1.4: Change Facilitation",
                score: 3
              },
              {
                category: "Indicator 1.5: Coaching, Growth, Feedback, and Professional Development",
                score: 3
              }
            ]
          }
        },
        {
          title: "Domain 2: Inspire Innovation",
          ratingsByYear: {
            2022: [
              {
                category: "Indicator 2.1: Human Capital",
                score: 3
              },
              {
                category: "Indicator 2.2: Talent Management",
                score: 3
              },
              {
                category: "Indicator 2.3: Observations, Feedback, and Coaching",
                score: 2
              },
              {
                category: "Indicator 2.4: Professional Development",
                score: 3
              }
            ]
          }
        },
        {
          title: "Domain 3: Strive for Excellence",
          ratingsByYear: {
            2022: [
              {
                category: "Indicator 3.1: Safe Environment and High Expectations",
                score: 3
              },
              {
                category: "Indicator 3.2: Behavioral Expectations and Management Systems",
                score: 4
              },
              {
                category: "Indicator 3.3: Proactive and Responsive Student Support Services",
                score: 4
              },
              {
                category: "Indicator 3.4: Involving Families and Community",
                score: 3
              }
            ]
          }
        },
        {
          title: "Domain 4: Develop Relationships",
          ratingsByYear: {
            2022: [
              {
                category: "Indicator 4.1: Standards-based Curricula and Assessments",
                score: 3
              },
              {
                category: "Indicator 4.2: Instructional Resources and Professional Development",
                score: 3
              }
            ]
          }
        }
      ];


    const { API_URL, API_CONFIG } = config();
    const [data, setData] = useState({});

    function losMapping(apiRecords)
    {
        var losUIjson = [];

        var catArr = [];
        var subCatArr = [];
        var scoresArr = {};

        var recordIndex = 0;
        while (recordIndex < apiRecords.length) {
            var catfound = false;
            catArr.forEach((cat, indexCat) => {
                if(cat == apiRecords[recordIndex].category){
                    return catfound = true;
                }
            });
            if(catfound == false){
                if(catArr[apiRecords[recordIndex].category] == undefined){
                    catArr[apiRecords[recordIndex].category] = [];
                }

                var subCatCat = false;
                catArr[apiRecords[recordIndex].category].forEach((e) => {
                    if(e == apiRecords[recordIndex].subCategory)
                    {return subCatCat = true;}
                });
                if(subCatCat == false)
                {catArr[apiRecords[recordIndex].category].push(apiRecords[recordIndex].subCategory);}
            }

            var subCatfound = false;
            subCatArr.forEach((subcat, indexSubCat) => {
                if(subcat == apiRecords[recordIndex].subCategory){
                    return subCatfound = true;
                }
            });
            if(subCatfound == false)
            {

                if(subCatArr[apiRecords[recordIndex].subCategory] == undefined){
                    subCatArr[apiRecords[recordIndex].subCategory] = [];
                }
                subCatArr[[apiRecords[recordIndex].subCategory]] = {
                    "subCatTitle" : apiRecords[recordIndex].subCategory,
                    "subCatNotes" : apiRecords[recordIndex].subCategory,
                }
            }

            if(scoresArr[[apiRecords[recordIndex].subCategory]] == undefined){
                scoresArr[[apiRecords[recordIndex].subCategory]] = [];
            }
            scoresArr[[apiRecords[recordIndex].subCategory]].push({
                "period": apiRecords[recordIndex].year,
                "districtMax": apiRecords[recordIndex].districtMax,
                "districtAvg": apiRecords[recordIndex].districtAvg,
                "staffScore": apiRecords[recordIndex].score,
            });

            if(subCatArr[[apiRecords[recordIndex].subCategory]]["scoresByPeriod"] == undefined)
            {
                subCatArr[[apiRecords[recordIndex].subCategory]]["scoresByPeriod"] = [];
            }
            recordIndex++;
        }

        Object.keys(scoresArr).forEach((e) => {
            subCatArr[e].scoresByPeriod = scoresArr[e];
        });

       Object.keys(catArr).forEach((ce) => {
            losUIjson.push(
            {
                "categoryTitle" : ce,
                "subCatCriteria" : catArr[ce].map((se) => {

                    return subCatArr[se];
                })
            })
        });
        return losUIjson;
    }

    useEffect(() => {
        let unmounted = false;

        const apiUrl = new URL(API_URL + `profiles/${id}`);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                // response.rating = GISD_RATING;
                var rating_titles = ['Domain 1: Grow Leaders', 'Domain 2: Inspire Innovation', 'Domain 3: Strive for Excellence', 'Domain 4: Develop Relationships'];
                response.rating = response.evaluations.filter(e => rating_titles.includes(e.title));
                response.evaluations = response.evaluations.filter(e => !rating_titles.includes(e.title));
                console.log(response);
                setData(response);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }, [id]);

    return { data, losMapping };
}

export default UseProfile;
