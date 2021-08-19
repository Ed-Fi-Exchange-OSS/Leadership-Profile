import React, {useState} from 'react';

const UsePills = () => {
    const [pills, setPills]= useState([]);

    const setNewPill = (filter, label, value) => {
        let newPill = {
            filter: filter,
            label: label,
            value: value
        }
        setPills(prevPills => [...prevPills, newPill]);
    }

    const removePill = (filterToRemove, name, value) => {
        if(typeof(filterToRemove) === 'object' && typeof(name) === 'undefined'){
            setPills(prevPills => prevPills.filter(pill => pill != filterToRemove));
        }

        if(typeof(filterToRemove) === 'string' && typeof(name) === 'undefined'){
            let pillToRemove = pills.find(e => e.filter === filterToRemove)

            if (pillToRemove)
                setPills(prevPills => prevPills.filter(pill => pill != pillToRemove));
        }
        
        if(typeof(filterToRemove) === 'string' && name && value){
            let pillToRemove = pills.find(e => e.filter === filterToRemove && e.label === name && e.value === value)

            if (pillToRemove)
                setPills(prevPills => prevPills.filter(pill => pill != pillToRemove));
        }
    }
    
    return{pills, setPills, setNewPill, removePill};
}

export default UsePills;