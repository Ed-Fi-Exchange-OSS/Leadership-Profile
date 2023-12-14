// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';

const BreadcrumbList = (props) => {
    const { currentPage } = props;

    return (
        <div className="breadcrumb-div">
            <div>
                <div>
                    <a href="/" className={currentPage === "profile" ? "previous-page" : "current-page"}>Home</a>
                    <span> &gt; </span>
                    {currentPage === 'profile' ?
                        (<a href="/profile" className="current-page">Contact details</a>)
                        : ''
                    }
                </div>
            </div>
        </div>
    );
};

export default BreadcrumbList;
