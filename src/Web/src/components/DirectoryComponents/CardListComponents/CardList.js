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
        <td className="pagination-buttons-container">
          <PaginationButtons paging={paging} setPage={setPage} />
        </td>
      </div>
    </>
  );
};

export default CardList;
