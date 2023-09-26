// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import {FormGroup, Input, Button} from 'reactstrap';

function DropdownTypeAhead({value, changeEvent, clearEvent}){
    return(
        <FormGroup className="filter-dropdown">
            <Input type="text" className="dropdown-menu-filter"
                value={value}
                onChange={changeEvent}
                autoComplete="off" placeholder="type school" />
            <Button className="filter-dropdown-clear" onClick={clearEvent}/>
        </FormGroup>
    )
}

export default DropdownTypeAhead;
