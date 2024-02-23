// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import PropTypes from 'prop-types';

const PaginationButtons = (props) => {
  const { paging, setPage } = props;
  const { page, maxPages, totalSize } = paging;
  const intPage = parseInt(page, 0);

  if (totalSize == 0) {
    return (<div></div>)
  }

  return (
    <div className="pagination-button-div">
      {/* eslint-disable */}
      {intPage > 1 ? <a className="pagination-arrows" onClick={() => setPage(intPage - 1)}>{'<'}</a> : ''}
      {intPage > 2 ? <a onClick={() => setPage(intPage - 2)}>{intPage - 2}</a> : ''}
      {intPage > 1 ? <a onClick={() => setPage(intPage - 1)}>{intPage - 1}</a> : ''}
      <a className="current-pagination-page">{page}</a>
      {intPage < maxPages ? <a onClick={() => setPage(intPage + 1)}>{intPage + 1}</a> : '' }
      {intPage < maxPages - 2 ? <a onClick={() => setPage(intPage + 2)}>{intPage + 2}</a> : '' }
      {intPage <= maxPages - 1 ? <a className="pagination-arrows" onClick={() => setPage(intPage + 1)}>{'>'}</a> : '' }
      {/* eslint-enable */}
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
