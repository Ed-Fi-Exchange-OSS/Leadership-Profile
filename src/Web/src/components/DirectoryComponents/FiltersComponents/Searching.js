import React from 'react';
import PropTypes from 'prop-types';

const Searching = (props) => {
    const { searchValue, onSearchValueChange } = props;
    return (
        <FormGroup className="w-50" className="search-by-name">
            <Input onChange={(e) => { this.onSearchValueChange(e) }} type="text" name="searchByName" placeholder="Search by name" className="w-100" />
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