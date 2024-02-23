// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useContext, useState } from "react"
import { FilterContext } from "./FilterContextProvider"

export const useFilterContext = () => {
    const [filterState, dispatch] = useState(FilterContext);

    const sendFilter = async(type, payload) => {
        return await dispatch({type: type, payload:payload});
    }

    return [filterState, sendFilter];
}
