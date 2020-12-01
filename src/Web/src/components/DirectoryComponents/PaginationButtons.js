import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'reactstrap';

const PaginationButtons = (props) => {
  const { paging, setPage } = props;
  const { page, maxPages } = paging;
  const intPage = parseInt(page, 0);
  return (
    <div>
      {intPage > 1 ? <a outline color="primary" onClick={() => setPage(intPage - 1)}>{'<'}</a> : ''}
      {intPage > 2 ? <a outline color="primary" onClick={() => setPage(intPage - 2)}>{intPage - 2}</a> : ''}
      {intPage > 1 ? <a outline color="primary" onClick={() => setPage(intPage - 1)}>{intPage - 1}</a> : ''}
      <a color="primary" active>{page}</a>
      {intPage < maxPages ? <a outline color="primary" onClick={() => setPage(intPage + 1)}>{intPage + 1}</a> : '' }
      {intPage < maxPages - 2 ? <a outline color="primary" onClick={() => setPage(intPage + 2)}>{intPage + 2}</a> : '' }
      {intPage <= maxPages - 1 ? <a outline color="primary" onClick={() => setPage(intPage + 1)}>{'>'}</a> : '' }
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