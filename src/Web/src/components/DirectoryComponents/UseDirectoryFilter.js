import React, {useState, useEffect} from "react";
import config from '../../config';

function UseDirectoryFilters () {
    const { API_URL, API_CONFIG } = config();
    const [positions, setPositions] = useState([]);
    const [nameSearch, setNameSearch] = useState();
    const [degrees, setDegrees] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [yearsOptionRange, setYearsOptionRange] = useState(-1);
    const [year, setYear] = useState();
    const [yearRange, setYearRange] = useState({min: 0, max: 0})

    async function getPositions(){
        fetchFilterData(`webcontrols/dropdownlist/assignments`, (response) => {
            responseSetter(response.assignments, setPositions);
        });
    }

    async function getDegrees(){
        fetchFilterData(`webcontrols/dropdownlist/degrees`, (response) => {
            responseSetter(response.degrees, setDegrees);
        });
    }

    async function getCertifications(){
        fetchFilterData(`webcontrols/dropdownlist/certifications`, (response) => {
            responseSetter(response.certifications, setCertifications);
        });
    }

    function responseSetter(responseObject, setter){
        var newResponse = [];
            responseObject.forEach(element => {
                newResponse.push({
                    "text": element.text,
                    "value": element.value,
                    "checked": false
                })
            });
        setter(newResponse);
    }

    async function fetchFilterData(queryString, callback){
        let unmounted = false;
        const apiUrl = new URL(API_URL + queryString);
        fetch(apiUrl, API_CONFIG('GET')
        ).then(response => response.json())
        .then((response) => {
            if (!unmounted && response !== null && typeof(callback) === 'function') {
                callback(response);
            }
        }).catch(error => {
            console.error(error.message);
        });
        return () => {
            unmounted = true;
        };
    }

    useEffect(() => {
        getPositions();
        getDegrees();
        getCertifications();
    }, [])

    return {positions, nameSearch, degrees, certifications, yearsOptionRange, year, yearRange,
         setPositions, setNameSearch, setDegrees, setCertifications, setYearsOptionRange, setYear, setYearRange};
}

export default UseDirectoryFilters;