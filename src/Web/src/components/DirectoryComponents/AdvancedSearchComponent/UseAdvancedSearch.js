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
        const apiUrl = new URL(API_URL + `webcontrols/dropdownlist/degrees`);
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
            "degrees": []
        };

        return specializations;
    }

    async function GetPositionHistory(){
        let unmounted = false;
        const apiUrl = new URL(API_URL + `webcontrols/dropdownlist/assignments`);
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
        const apiUrl = new URL(API_URL + `webcontrols/dropdownlist/certifications`);
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
        const apiUrl = new URL(API_URL + `webcontrols/dropdownlist/measurementcategories`);
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
        const apiUrl = new URL(API_URL + `webcontrols/dropdownlist/measurementsubcategories`);
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