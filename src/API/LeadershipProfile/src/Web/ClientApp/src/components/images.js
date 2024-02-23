// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';

const DefaultProfile = () =>
    <img width="50px" height="50px" alt="profile" alt="default profile" className="rounded-circle"
    src={process.env.PUBLIC_URL + "/images/generic-profile.png"} />

const HeaderLogo = () =>
    <img alt="header-logo" src={process.env.PUBLIC_URL + "/images/header-logo.png"}/>
export{
    DefaultProfile,
    HeaderLogo
};
