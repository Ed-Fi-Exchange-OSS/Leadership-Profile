import React, {useState} from 'react';
import { useFilterContext } from '../../../context/filters/UseFilterContext';
import PillType from "../../../utils/Constants";
import FilterActions from '../../../context/filters/FilterActions';

const UsePills = () => {
    const pillTypes = PillType;
    const [filterState, sendFilter] = useFilterContext();

    const setNewPill = (filter, label, value) => {
        let newPill = {
            filter: filter,
            label: label,
            value: value
        }
        return newPill;
    }

    const removePill = (filterToRemove, name, value) => {
        let pillToRemove;
        if(typeof(filterToRemove) === 'object' && typeof(name) === 'undefined'){
            pillToRemove = filterToRemove;
        }

        if(typeof(filterToRemove) === 'string' && typeof(name) === 'undefined'){
            pillToRemove = filterState.pills.find(e => e.filter === filterToRemove)
        }
        
        if(typeof(filterToRemove) === 'string' && name && value){
            pillToRemove = filterState.pills.find(e => e.filter === filterToRemove && e.label === name && e.value === value)
        }

        if (pillToRemove) sendFilter(FilterActions.removePill, pillToRemove);
    }

    function getTypeAction(filterType, isAdd){
        switch(filterType){
            case pillTypes.Position:{
                return isAdd ? FilterActions.setPosition : FilterActions.removePosition;
            }
            case pillTypes.Institution:{
                return isAdd ? FilterActions.setIntitution : FilterActions.removeInstitution;
            }
            case pillTypes.Degree:{
                return isAdd ? FilterActions.setDegree : FilterActions.removeDegree;
            }
            case pillTypes.Tenure:{
                return isAdd ? FilterActions.setTenure : FilterActions.removeTenure;
            }
        }
    }

    return{setNewPill, removePill, pillTypes, getTypeAction};
}

export default UsePills;