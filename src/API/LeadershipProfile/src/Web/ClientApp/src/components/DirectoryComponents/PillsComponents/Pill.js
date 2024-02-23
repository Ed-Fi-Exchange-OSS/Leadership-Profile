// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';

const Pill = (props) =>{
    const {label, value, handleRemove} = props
    return(
        <React.Fragment>
            <div className="pill" key={`${label}-${value}`}>
                {label}
                <span className="remove-pill" onClick={() => handleRemove()}>x</span>
            </div>
        </React.Fragment>
    )
}

export default Pill;
