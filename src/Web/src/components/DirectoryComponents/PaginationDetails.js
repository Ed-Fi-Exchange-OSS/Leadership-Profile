import React from "react";

const PaginationDetails = (props) => {
  const { paging } = props;
  const { page, totalSize } = paging;

  if (totalSize == "0") {
    return (<div></div>);
  }

  return (
    <span>
      Showing {page == 1 ? 1 : (page - 1) * 10 + 1}-
      {(page - 1) * 10 + 10} of {totalSize} Users
    </span>
  );
};

export default PaginationDetails;
