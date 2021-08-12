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