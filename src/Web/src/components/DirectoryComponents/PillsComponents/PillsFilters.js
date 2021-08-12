import React, { useEffect } from 'react';
import Pill from './Pill';

const PillsFilters = (props) =>{
    const {pills, handleRemove, handleRemoveAll} = props;

    const clearAll = () => {
        handleRemoveAll();
    }

    const removePill = (pill) =>{
        handleRemove(pill);
    }

    return(
        <div>
            {pills.length > 0 && 
            <div className="selected-filters">
                <a href="#" className="selected-filters-clear" onClick={() => clearAll()}>Clear All</a>
                <div className="selected-filters-wrapper">
                    <span>Active Filters:</span>
                        {
                            pills.map((element, index) => {
                                return(
                                    <Pill 
                                        key={`${element.label}-${element.value}`} 
                                        label={element.label} 
                                        value={element.value}
                                        handleRemove={() => removePill(element)} />
                                )
                            })
                        }
                </div>
            </div>
           }
        </div>
    )
}

export default PillsFilters;