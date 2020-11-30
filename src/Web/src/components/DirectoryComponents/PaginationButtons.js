import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from 'reactstrap';

const PaginationButtons = (props) => {
  const { paging, setPage } = props;
  const { page, maxPages } = paging;
  const intPage = parseInt(page, 0);
  return (
    <ButtonGroup>
      {intPage > 1 ? <Button outline color="primary" onClick={() => setPage(1)}>{'<<'}</Button> : ''}
      {intPage > 1 ? <Button outline color="primary" onClick={() => setPage(intPage - 1)}>{'<'}</Button> : ''}
      {intPage > 2 ? <Button outline color="primary" onClick={() => setPage(intPage - 2)}>{intPage - 2}</Button> : ''}
      {intPage > 1 ? <Button outline color="primary" onClick={() => setPage(intPage - 1)}>{intPage - 1}</Button> : ''}
      <Button color="primary" active>{page}</Button>
      {intPage < maxPages ? <Button outline color="primary" onClick={() => setPage(intPage + 1)}>{intPage + 1}</Button> : '' }
      {intPage < maxPages - 2 ? <Button outline color="primary" onClick={() => setPage(intPage + 2)}>{intPage + 2}</Button> : '' }
      {intPage < maxPages - 1 ? <Button outline color="primary" onClick={() => setPage(intPage + 1)}>{'>'}</Button> : '' }
      {page < maxPages ? <Button outline color="primary" onClick={() => setPage(maxPages)}>{'>>'}</Button> : '' }
    </ButtonGroup>
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