import React from 'react';
import PropTypes from 'prop-types';

const Filtering = (props) => {
}

Filtering.defaultProps = {
    status: 'asc',
    onSortChange: null,
    children: null,
};

Filtering.propTypes = {
    status: PropTypes.string,
    onSortChange: PropTypes.func,
    children: PropTypes.element,
};

export default Filtering;