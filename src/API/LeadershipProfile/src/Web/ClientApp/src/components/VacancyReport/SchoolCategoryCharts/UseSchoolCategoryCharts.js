// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { useState, useEffect } from "react";




function UserSchoolCategoryCharts() {

    const [selectedVacancyYear, setSelectedVacancyYear] = useState(null);
    const [vacancyProjection, setVacancyProjection] = useState([]);
    const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(1);



    return {
        selectedVacancyYear, setSelectedVacancyYear,
        vacancyProjection, setVacancyProjection,
        selectedSchoolLevel, setSelectedSchoolLevel
    };
}


export default UserSchoolCategoryCharts;
