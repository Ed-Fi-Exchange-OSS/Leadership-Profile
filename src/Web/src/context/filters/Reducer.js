import FilterActions from "./FilterActions";
import {INITIAL_FILTERS_STATE} from "../../utils/Constants";

const Reducer = (state, action) => {
    const {setNameFilter, setPosition, removePosition, setIntitution, removeInstitution, 
        setDegree, removeDegree, setTenure, removeTenure, setRatingCategory, setRatingScore, removeRating, removePill, clearFilters} = FilterActions;

    switch(action.type){
        case setNameFilter: { 
            return {
                ...state,
                nameSearch: action.payload
            }
        }
        case setPosition: {
            let filterPill = action.payload;
            return {
                ...state,
                positions: [...state.positions, filterPill.value],
                pills: [...state.pills, filterPill]
            }
        }
        case removePosition: {
            let filterPill = action.payload;
            return {
                ...state,
                positions: state.positions.filter(value => value !== filterPill.value),
                pills: state.pills.filter(value => value !== filterPill)
            }
        }
        case setTenure:{
            let filterPill = action.payload;
            return {
                ...state,
                tenure: [...state.tenure, filterPill.value],
                pills: [...state.pills, filterPill]
            }
        }
        case removeTenure:{
            let filterPill = action.payload;
            return {
                ...state,
                tenure: state.tenure.filter(value => value !== filterPill.value),
                pills: state.pills.filter(value => value !== filterPill)
            }
        }
        case setIntitution: {
            let filterPill = action.payload;
            return {
                ...state,
                institutions: [...state.institutions, filterPill.value],
                pills: [...state.pills, filterPill]
            }
        }
        case removeInstitution: {
            let filterPill = action.payload;
            return {
                ...state,
                institutions: state.institutions.filter(value => value !== filterPill.value),
                pills: state.pills.filter(value => value !== filterPill)
            }
        }
        case setDegree: {
            let filterPill = action.payload;
            return {
                ...state,
                degrees: [...state.degrees, filterPill.value],
                pills: [...state.pills, filterPill]
            }
        }
        case removeDegree: {
            let filterPill = action.payload;
            return {
                ...state,
                degrees: state.degrees.filter(value => value !== filterPill.value),
                pills: state.pills.filter(value => value !== filterPill)
            }
        }
        case removePill: {
            return {
                ...state,
                pills: state.pills.filter(value => value !== action.payload)
            }
        }
        case setRatingCategory: {
            return {
                ...state,
                categoryLabel: action.payload.text,
                category: action.payload.value
            }
        }
        case setRatingScore: {
            let newFilterPill = action.payload;
            return {
                ...state,
                score: newFilterPill.value,
                pills: state.pills.some(pill => pill.filter === newFilterPill.filter)
                    ? state.pills.map(prevPill => (prevPill.filter === newFilterPill.filter) ? newFilterPill : prevPill)            
                    : [...state.pills, newFilterPill]
            }
        }
        case removeRating: {
            return {
                ...state,
                score: 0,
                category: '',
                categoryLabel: '',
                pills: state.pills.filter(value => value !== action.payload)
            }
        }
        case clearFilters: {
            return {...INITIAL_FILTERS_STATE }
        }     
        default:
            return state;
    }
};

export default Reducer;