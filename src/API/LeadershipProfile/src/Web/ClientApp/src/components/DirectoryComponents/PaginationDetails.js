// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from "react";

const PaginationDetails = (props) => {
  const { paging, count } = props;
  const { page, totalSize } = paging;

  if (totalSize == "0") {
    return (<div></div>);
  }

  if (!count || count === 0){
    return (
      <span>No Results</span>
    );
  }

  return (
    <span>
      Showing {page == 1 ? 1 : (page - 1) * 10 + 1}-
      {(page - 1) * 10 + count} of {totalSize} Users
    </span>
  );
};

export default PaginationDetails;
