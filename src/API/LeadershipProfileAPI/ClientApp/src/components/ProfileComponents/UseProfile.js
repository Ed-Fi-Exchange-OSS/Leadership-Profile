import { useState, useEffect } from 'react';
import config from '../../config';

function UseProfile(id) {
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

        const apiUrl = new URL(API_URL + `profile/${id}`);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
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