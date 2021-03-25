import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import config from '../../../config';

function UseAdvancedSearch(){
    const { API_URL, API_CONFIG } = config();

    const [degrees, setDegrees] = useState([]);
    const [assignment, setAssignment] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    async function GetDegrees(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/degrees`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.degrees.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setDegrees(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    async function GetSpeciaizations(){

        var specializations = {
            "degrees": [
            {
                "text": "AA",
                "value": 4388
            },
            {
                "text": "BA",
                "value": 4389
            },
            {
                "text": "BS",
                "value": 4390
            },
            {
                "text": "MA",
                "value": 4391
            },
            {
                "text": "MA+45",
                "value": 4392
            },
            {
                "text": "None",
                "value": 4393
            },
            {
                "text": "PhD",
                "value": 4394
            },
            {
                "text": "Associates",
                "value": 4395
            },
            {
                "text": "Bachelors",
                "value": 4396
            },
            {
                "text": "Masters",
                "value": 4397
            },
            {
                "text": "Associate's",
                "value": 11769
            },
            {
                "text": "Bachelor's",
                "value": 11770
            },
            {
                "text": "Master's",
                "value": 11771
            }
            ]
        };

        return specializations;
    }

    async function GetPositionHistory(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/assignments`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.assignments.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setAssignment(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    async function GetCertifications(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/certifications`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                var newResponse = [];
                response.certifications.forEach(element => {
                    newResponse.push({
                        "text": element.text,
                        "value": element.value,
                        "checked": false
                    })
                });
                setCertifications(newResponse);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    async function GetCatergories(){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/measurementcategories`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {
                if(response.categories.length != 0){                        
                    var newResponse = [];
                    response.categories.forEach(element => {
                        newResponse.push({
                            "text": element.Category,
                            "value": element.CategoryId,
                            "selected": false
                        })
                    });
                    setCategories(newResponse);
                }

            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    function GetSubCategories(categorieId){
        let unmounted = false;
        const apiUrl = new URL(`api/webcontrols/dropdownlist/measurementsubcategories`, API_URL);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null) {                
                if(response.subCategories.length == 0){
                    var newResponse = [];
                    response.subCategories.forEach(element => {
                        newResponse.push({
                            "text": element.Category,
                            "value": element.CategoryId,
                            "selected": false
                        })
                    });
                    setSubCategories(newResponse);                    
                }
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    useEffect(() => {
        GetDegrees();
        GetPositionHistory();
        GetCertifications();
        GetCatergories();
    }, [])

    return {degrees, assignment, certifications, categories, subCategories,
        setDegrees, setAssignment, setCertifications, setCategories, setSubCategories, GetSubCategories}
}

export default UseAdvancedSearch;