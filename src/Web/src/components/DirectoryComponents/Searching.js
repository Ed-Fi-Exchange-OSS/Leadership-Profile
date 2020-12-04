import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';
import { SearchIcon } from '../Icons';

const Searching = (props) => {
    const { onSearchValueChange } = props;

    function handleOnChange(value) {
        onSearchValueChange(value);
    }

    return (
        <FormGroup className="w-50 search-by-name">
            <Input disabled onChange={e => handleOnChange(e.target.value)} type="text" name="searchByName" placeholder="Search by name" className="w-100" />
            <SearchIcon stylingId="search-by-name-icon" />
        </FormGroup>
    );
}

Searching.defaultProps = {
    searchValue: '',
    onSearchValueChange: null
};

Searching.propTypes = {
    searchValue: PropTypes.string,
    onSearchValueChange: PropTypes.func
};

export default Searching;