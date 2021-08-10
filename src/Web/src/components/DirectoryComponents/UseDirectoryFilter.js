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

    async function GetPositions(){
        FetchFilterData(`webcontrols/dropdownlist/assignments`, (response) => {
            var newResponse = [];
            response.assignments.forEach(element => {
                newResponse.push({
                    "text": element.text,
                    "value": element.value,
                    "checked": false
                })
            });
            setPositions(newResponse);
        });
    }

    async function GetDegrees(){
        FetchFilterData(`webcontrols/dropdownlist/degrees`, (response) => {
            var newResponse = [];
            response.degrees.forEach(element => {
                newResponse.push({
                    "text": element.text,
                    "value": element.value,
                    "checked": false
                })
            });
            setDegrees(newResponse);
        });
    }

    async function GetCertifications(){
        FetchFilterData(`webcontrols/dropdownlist/certifications`, (response) => {
            var newResponse = [];
            response.certifications.forEach(element => {
                newResponse.push({
                    "text": element.text,
                    "value": element.value,
                    "checked": false
                })
            });
            setCertifications(newResponse);
        });
    }

    async function FetchFilterData(queryString, callback){
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
        GetPositions();
        GetDegrees();
        GetCertifications();
    }, [])

    return {positions, nameSearch, degrees, certifications, yearsOptionRange, year, yearRange,
         setPositions, setNameSearch, setDegrees, setCertifications, setYearsOptionRange, setYear, setYearRange};
}

export default UseDirectoryFilters;