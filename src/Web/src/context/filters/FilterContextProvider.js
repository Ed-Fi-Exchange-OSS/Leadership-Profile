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