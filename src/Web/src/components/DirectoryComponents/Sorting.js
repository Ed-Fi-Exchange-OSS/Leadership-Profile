import React from 'react';
import PropTypes from 'prop-types';
import { SortIcon } from '../Icons'

function selectNewStatus(status) {
  const values = [null, 'asc', 'desc'];
  switch (status) {
    case values[0]:
      return values[1];
    case values[1]:
      return values[2];
    case values[2]:
      return values[1];
    default:
      return values[0];
  }
}

const Sorting = (props) => {
  const { status, onSortChange } = props;
  return (
    <span onClick={() => onSortChange(selectNewStatus(status))}>
      <SortIcon />
    </span>
  );
};

Sorting.defaultProps = {
  status: 'asc',
  onSortChange: null,
  children: null,
};

Sorting.propTypes = {
  status: PropTypes.string,
  onSortChange: PropTypes.func,
  children: PropTypes.element,
};

export default Sorting;