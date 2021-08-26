import { useContext } from "react"
import { FilterContext } from "./FilterContextProvider"

export const useFilterContext = () => {
    const [filterState, dispatch] = useContext(FilterContext);

    const sendFilter = async(type, payload) => {
        return await dispatch({type: type, payload:payload});
    }

    return [filterState, sendFilter];
}