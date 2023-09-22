import FilterActions from "./FilterActions";
import {INITIAL_FILTERS_STATE} from "../../utils/Constants";

const Reducer = (state, action) => {
    const {setNameFilter, setPosition, removePosition, setIntitution, removeInstitution, setSchoolCategory, removeSchoolCategory,
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
        case setSchoolCategory: {
            let filterPill = action.payload;
            return {
                ...state,
                schoolCategories: [...state.schoolCategories, filterPill.value],
                pills: [...state.pills, filterPill]
            }
        }
        case removeSchoolCategory: {
            let filterPill = action.payload;
            return {
                ...state,
                schoolCategories: state.schoolCategories.filter(value => value !== filterPill.value),
                pills: state.pills.filter(value => value !== filterPill)
            }
        }
        case removePill: {
            return {
                ...state,
                pills: state.pills.filter(value => value !== action.payload)
            }
        }
        case setRatingScore: {
            let newFilterPill = action.payload;
            return {
                ...state,
                scores: [...state.scores.filter(s => s.category !== newFilterPill.value.category), { category: newFilterPill.value.category, score: newFilterPill.value.score}],
                pills: [...state.pills.filter(pill => pill.filter !== newFilterPill.filter || pill.value?.category !== newFilterPill.value.category), newFilterPill]
            }
        }
        case removeRating: {
            return {
                ...state,
                scores: state.scores.filter(s => s.category !== action.payload.value.category),
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