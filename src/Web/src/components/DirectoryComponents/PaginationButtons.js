import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'reactstrap';

const PaginationButtons = (props) => {
  console.log(props);
  const { paging, setPage } = props;
  const { page, maxPages } = paging;
  const intPage = parseInt(page, 0);
  return (
    <div className="pagination-button-div">
      {intPage > 1 ? <a className="pagination-arrows" onClick={() => setPage(intPage - 1)}>{'<'}</a> : ''}
      {intPage > 2 ? <a onClick={() => setPage(intPage - 2)}>{intPage - 2}</a> : ''}
      {intPage > 1 ? <a onClick={() => setPage(intPage - 1)}>{intPage - 1}</a> : ''}
      <a class="current-pagination-page">{page}</a>
      {intPage < maxPages ? <a onClick={() => setPage(intPage + 1)}>{intPage + 1}</a> : '' }
      {intPage < maxPages - 2 ? <a onClick={() => setPage(intPage + 2)}>{intPage + 2}</a> : '' }
      {intPage <= maxPages - 1 ? <a className="pagination-arrows" onClick={() => setPage(intPage + 1)}>{'>'}</a> : '' }
    </div>
  );
};

PaginationButtons.defaultProps = {
  paging: {
    page: 1,
    totalSize: 10,
    sizePerPage: 10,
    maxPages: 1,
  },
  setPage: null,
};

PaginationButtons.propTypes = {
  paging: PropTypes.object,
  setPage: PropTypes.func,
};

export default PaginationButtons;