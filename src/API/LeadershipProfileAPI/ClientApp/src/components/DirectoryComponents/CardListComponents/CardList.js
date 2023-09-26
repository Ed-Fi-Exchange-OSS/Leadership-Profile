// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from "react";
import CardProfile from "./CardProfile";
import PaginationDetails from "../PaginationDetails";
import PaginationButtons from "../PaginationButtons";

const CardList = (props) => {
  const { data, paging, setPage } = props;

  return (
    <>
      <div className="card-layout">
        {data.map((profile, index) => {
          return <CardProfile key={index} data={profile}></CardProfile>;
        })}
      </div>
      <div className="card-pagination-grid">
        <div>
          <PaginationDetails paging={paging} count={data?.length} />
        </div>
        <div className="pagination-buttons-container">
          <PaginationButtons paging={paging} setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default CardList;
