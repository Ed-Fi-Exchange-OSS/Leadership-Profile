// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect } from 'react';
import { useFilterContext } from '../../../context/filters/UseFilterContext';
import Pill from './Pill';

const PillsFilters = (props) =>{
    const { handleRemove, handleRemoveAll} = props;
    const [pillState, send] = useFilterContext();

    const clearAll = () => {
        handleRemoveAll();
    }

    const removePill = (pill) =>{
        handleRemove(pill);
    }

    return(
        <div>
            {(pillState.pills ?? []).length > 0 &&
            <div className="selected-filters">
                <div className="d-flex justify-content-end">
                    <a className="selected-filters-clear mx-3" onClick={() => clearAll()}>Clear Filters</a>
                </div>
                <div className="selected-filters-wrapper">
                    <span>Active Filters:</span>
                        {
                            (pillState.pills ?? []).map((element, index) => {
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
