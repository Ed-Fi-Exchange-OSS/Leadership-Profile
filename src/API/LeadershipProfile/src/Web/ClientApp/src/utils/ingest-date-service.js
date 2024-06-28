// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

function IngestDateService() {
    function getLastIngestionDate() {
        return {
            "ISD": "Garland ISD",
            "Date": new Date("2024-06-13"),
            "ItemsProccessed": 4018
        };
    }

    return { getLastIngestionDate };
}

export default IngestDateService;
