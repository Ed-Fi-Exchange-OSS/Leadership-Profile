// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

function config() {
    var getUrl = window.location;
     //const API_URL = process.env.NODE_ENV === 'production' ? new URL(`${getUrl.protocol}//${getUrl.host}/api/`) : new URL('https://victorialeadership.developers.net/api/');
    const API_URL = process.env.NODE_ENV === 'production' ? new URL(`${getUrl.protocol}//${getUrl.host}/api/`) : new URL('https://garlandleadership.developers.net/api/');
    //const API_URL = process.env.NODE_ENV === 'production' ? new URL(`${getUrl.protocol}//${getUrl.host}/api/`) : new URL('https://localhost:44447/api/');
    const API_CONFIG = (method, body=null) => {
        return {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            referrerPolicy: 'origin-when-cross-origin',
            body: body
        }
    }

    const SCHOOL_HEADER = "Leadership Portal"
    return {API_URL, API_CONFIG, SCHOOL_HEADER}
}

export default config;

