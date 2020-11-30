import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';
import { SearchIcon } from '../Icons';

const Searching = (props) => {
    const { searchValue, onSearchValueChange } = props;

    function handleChange(e) {
        e.preventDefault();
        onSearchValueChange(e.target.value);
    }

    return (
        <FormGroup className="w-50 search-by-name">
            <Input onChange={(e) => handleChange(e)} type="text" name="searchByName" placeholder="Search by name" className="w-100" />
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