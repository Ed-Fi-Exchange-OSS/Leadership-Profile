import React, { useState, useEffect, useRef } from "react";
import { CardTitle, Collapse, Table } from "reactstrap";
import { DownPointingIcon } from "../Icons";
import CanvasChart from "./CanvasChart";

const CollapsibleLeaderOfSelf = (props) => {
  const { title, data } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="profile-collapsible-container">
      <h2 className="profile-collapsible-header" onClick={toggle}>
        <span className="profile-collapsible-icon"></span>
        <span>{data.categoryTitle}</span>
        <span className="profile-collapsible-down-icon">
          <DownPointingIcon />
        </span>
      </h2>
      <Collapse isOpen={isOpen}>
        <div className="profile-collapsible-table">
          <div className="container profile-info-text">
            {data.subCatCriteria.map((subCrit, i) => {
              return (
                <div className="row top-buffer">
                  <div className="col-sm-8">
                    <div class="card">
                      <div class="card-footer text-muted">
                        <div class="row">
                          <div className="col-sm-8">
                            <h6>
                              <b>{subCrit.subCatTitle}</b>
                            </h6>
                            <p>
                              <i>
                                {subCrit.subCatNotes}
                              </i>
                            </p>
                          </div>
                          <div className="col-sm-4 scores-box">
                            <p></p>
                            <p>
                              <b>Staff Score: {subCrit.staffScore}</b>
                            </p>
                            <p>
                              <b>District Avg: {subCrit.districtAvg}</b>
                            </p>
                            <p>
                              <b>District Max: {subCrit.districtMax}</b>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div class="card">
                      <div class="card-body">
                        <CanvasChart data={subCrit} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleLeaderOfSelf;
