// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, {useState, useEffect} from "react";
import config from '../../config';
import { useFilterContext } from "../../context/filters/UseFilterContext";
import { TENURE_RANGES } from "../../utils/Constants";

function UseDirectoryFilters () {
    const { API_URL, API_CONFIG } = config();
    const [filterState, send] = useFilterContext();

    const [positions, setPositions] = useState([]);
    const [nameSearch, setNameSearch] = useState(filterState.nameSearch);
    const [degrees, setDegrees] = useState([]);
    const [schoolCategories, setSchoolCategories] = useState([]);
    const [yearsOptionRange, setYearsOptionRange] = useState(-1);
    const [year, setYear] = useState('');
    const [yearRange, setYearRange] = useState({min: 0, max: 0})
    const [institutions, setInstitutions] = useState([]);
    const [tenureRanges, setTenureRanges] = useState([]);
    const [filteredInstitutions, setFilteredInstitutions] = useState(institutions);
    const [filterInstitutionValue, setFilterInstitutionValue] = useState();
    const [categories, setCategories] = useState([]);
    const [otherCategories, setOtherCategories] = useState([]);

    async function getPositions(){
        fetchFilterData(`WebControls/Assignments`, (response) => {
            responseSetter(response, setPositions, filterState.positions);
        });
    }

    async function getDegrees(){
        fetchFilterData(`WebControls/Degrees`, (response) => {
            responseSetter(response, setDegrees, filterState.degrees);
        });
    }

    async function getSchoolCategories(){
        fetchFilterData(`WebControls/SchoolCategories`, (response) => {
            responseSetter(response, setSchoolCategories, filterState.schoolCategories);
        });
    }

    async function getInstitutions(){
        fetchFilterData(`WebControls/Institutions`, (response) => {
            responseSetter(response, setInstitutions, filterState.institutions);
        });
    }

    async function getTenureRanges(){
        responseSetter(ranges, setTenureRanges, filterState.tenure);
    }

    let ranges =  buildTenureRangesOptions();

    function buildTenureRangesOptions(){
        let result = [];
        let lastOption =  Object.keys(TENURE_RANGES)[Object.keys(TENURE_RANGES).length - 1]
        for(let key of Object.keys(TENURE_RANGES)){
            let value = TENURE_RANGES[key];
            if (key === lastOption) {
                result.push({text: (value.min+"+ years"), value: key});
            }
            else{
                result.push({text: value.min+"-"+value.max+" years", value:key});
            }
        }

        return result;
    };

    async function getCategories(){
        fetchFilterData(`WebControls/MeasurementCategories`, (response) => {
            var cats = response.categories.filter(c => c.evaluationTitle != "Texas Principal Evaluation & Support Systems");            
            var otherCats = response.categories.filter(c => c.evaluationTitle == "Texas Principal Evaluation & Support Systems");
            responseSetter(cats, setCategories, null, false);
            responseSetter(otherCats, setOtherCategories, null, false);
        });
    }

    function responseSetter(responseObject, setter, initialState, isCheckboxFilter = true){
        var selected = isCheckboxFilter ? "checked" : "selected";
        var newResponse = [];
            if (responseObject) responseObject.forEach(element => {
                newResponse.push({
                    "text": element.text ?? element.category,
                    "value": element.value,
                    [selected]: initialState ? initialState.includes(element.value) : false
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

    function setCheckValueForElement(elements, setter, value, isChecked){
        let newElements = [...elements];
        newElements.forEach((element) => {
            if (element.value == value) {
                element.checked = isChecked;
            }
        });
        setter(newElements);
    }

    function unCheckAllFromElement(elements, setter){
        let newElements = [...elements];
        newElements.forEach((element) => {
            if(element.checked)
                element.checked = false;
        });
        setter(newElements);
    }

    useEffect(() => {
        getPositions();
        getDegrees();
        getSchoolCategories();
        getInstitutions();
        getCategories();
        getTenureRanges();
    }, [])

    useEffect(() => {
        setFilteredInstitutions(institutions);
    }, [institutions])

    return {positions, nameSearch, degrees, schoolCategories, yearsOptionRange, year, yearRange,
        institutions, filteredInstitutions, filterInstitutionValue, categories, otherCategories, tenureRanges,
         setPositions, setNameSearch, setDegrees, setSchoolCategories, setYearsOptionRange, setYear, setYearRange,
         setInstitutions, setFilteredInstitutions, setFilterInstitutionValue,
        setCheckValueForElement, unCheckAllFromElement, setTenureRanges,
        setCategories,  setOtherCategories};
}

export default UseDirectoryFilters;
