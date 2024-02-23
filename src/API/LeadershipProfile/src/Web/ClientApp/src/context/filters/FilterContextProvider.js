// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, {createContext, useReducer} from "react";
import {INITIAL_FILTERS_STATE} from "../../utils/Constants";
import Reducer from "./Reducer";

const initialState = {...INITIAL_FILTERS_STATE};

const FilterContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <FilterContext.Provider value={[state, dispatch]}>
            {children}
        </FilterContext.Provider>
    )
}
export default FilterContextProvider;

export const FilterContext = createContext(initialState);
