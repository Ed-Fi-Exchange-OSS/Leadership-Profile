// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Searching from "./Searching";
import UseDirectoryFilters from "./UseDirectoryFilter";
import DropdownTypeAhead from "./DropdownTypeAhead";
import PillsFilters from "./PillsComponents/PillsFilters";
import UsePills from "./PillsComponents/UsePills";
import { useFilterContext } from "../../context/filters/UseFilterContext";
import FilterActions from "../../context/filters/FilterActions";
import { SCORE_OPTIONS, TENURE_RANGES } from "../../utils/Constants";
import { Table } from "reactstrap";

const CreateDirectoryFilters = (props) => {
  function RenderFilters(data) {
    const {
      positions,
      setPositions,
      nameSearch,
      setNameSearch,
      degrees,
      setDegrees,
      schoolCategories,
      setSchoolCategories,
      yearsOptionRange,
      setYearsOptionRange,
      setYearRange,
      institutions,
      setInstitutions,
      filteredInstitutions,
      setFilteredInstitutions,
      filterInstitutionValue,
      setFilterInstitutionValue,
      tenureRanges,
      setTenureRanges,
      setCheckValueForElement,
      unCheckAllFromElement,
      categories,
      otherCategories,
      aspires,
      setAspires
    } = UseDirectoryFilters();

    const { setNewPill, removePill, pillTypes, getTypeAction } = UsePills();
    const [filterState, sendFilter] = useFilterContext();

    const [category, setCategory] = useState({label:'', name:''});
    // const [aspires, setAspires] = useState();

    function CheckSelectedItem(target, elements, setter, type) {
      setCheckValueForElement(elements, setter, target.value, target.checked);
      setCheckedFilterAsPill(type, target);
    }

    function setCheckedFilterAsPill(filterType, target) {
      let action = getTypeAction(filterType, target.checked);
      let pill = setNewPill(filterType, target.name, parseInt(target.value));
      sendFilter(action, pill);
    }

    function GetCheckedOrSelectedValues(elements) {
      return (
        elements?.filter((x) => x.checked || x.selected).map((x) => x.value) ??
        []
      );
    }

    function OnChangeSubmit(isClearing) {
      let selectedTenureRanges = getYearRange(filterState.tenure);

      let filters = {
        Assignments: {
          Values: filterState.positions,
        },
        Degrees: {
          Values: filterState.degrees,
        },
        SchoolCategories: {
          Values: filterState.schoolCategories,
        },
        Name: filterState.nameSearch,
        Institutions: {
          Values: filterState.institutions,
        },
        Ratings: filterState.scores,
        YearsOfPriorExperienceRanges: {
          Values: selectedTenureRanges,
        },
        Aspires: {
          Values: filterState.aspires,
        },
      };

      console.log(filters);
      props.directoryFilteredSearchCallback(filters);
    }

    function Position_OnChange(e) {
      CheckSelectedItem(
        e.currentTarget,
        positions,
        setPositions,
        pillTypes.Position
      );
    }

    function NameSearch_OnChange(value) {
      setNameSearch(value);
      if (value.length >= 2 || value.length === 0) {
        sendFilter(FilterActions.setNameFilter, value);
      }
    }

    function Degree_OnChange(e) {
      CheckSelectedItem(e.currentTarget, degrees, setDegrees, pillTypes.Degree);
    }

    function SchoolCategory_OnChange(e) {
      CheckSelectedItem(
        e.currentTarget,
        schoolCategories,
        setSchoolCategories,
        pillTypes.SchoolCategory
      );
    }

    function YearOption_OnChange(value) {
      setYearsOptionRange(value);
    }

    function Tenure_OnChange(e) {
      CheckSelectedItem(
        e.currentTarget,
        tenureRanges,
        setTenureRanges,
        pillTypes.Tenure
      );
    }

    function Institution_Onchange(e) {
      CheckSelectedItem(
        e.currentTarget,
        filteredInstitutions,
        setFilteredInstitutions,
        pillTypes.Institution
      );
    }

    function institutionFiltering(value) {
      setFilterInstitutionValue(value);
    }

    function removePillAndFilter(pill) {
      if (pill.filter === pillTypes.Position) {
        setCheckValueForElement(positions, setPositions, pill.value, false);
      }
      if (pill.filter === pillTypes.Degree) {
        setCheckValueForElement(degrees, setDegrees, pill.value, false);
      }
      if (pill.filter === pillTypes.Institution) {
        setCheckValueForElement(
          filteredInstitutions,
          setFilteredInstitutions,
          pill.value,
          false
        );
      }
      if (pill.filter === pillTypes.Tenure) {
        setCheckValueForElement(
          tenureRanges,
          setTenureRanges,
          pill.value,
          false
        );
      }
      if (pill.filter === pillTypes.SchoolCategory) {
        setCheckValueForElement(
          schoolCategories,
          setSchoolCategories,
          pill.value,
          false
        );
        if(pill.filter === pillTypes.Rating){

        }
      }
      if (pill.filter === pillTypes.Aspires) {
        setCheckValueForElement(
          aspires,
          setAspires,
          pill.value,
          false
        );
      }

      sendFilter(getTypeAction(pill.filter, false), pill);
      OnChangeSubmit();
    }

    function removeAllPills() {
      sendFilter(FilterActions.clearFilters);
      unCheckAllFromElement(positions, setPositions);
      unCheckAllFromElement(degrees, setDegrees);
      unCheckAllFromElement(filteredInstitutions, setFilteredInstitutions);
      unCheckAllFromElement(tenureRanges, setTenureRanges);
      unCheckAllFromElement(schoolCategories, setSchoolCategories);
      OnChangeSubmit(true);
    }

    function getYearRange(tenureOptions) {
      let ranges = [];

      if (typeof tenureOptions !== "undefined") {
        tenureOptions.forEach((option) => {
          ranges.push(TENURE_RANGES[option]);
        });
      }
      return ranges;
    }

    function onClickCategory(e) {
      // Clear filter/pill if default Category selected
      if (e.currentTarget.value === "") {
        setCategory({label:'', category:''});
        return;
      }

      setCategory({label: e.currentTarget.innerText, category: e.currentTarget.value});
    }
    
    function onClickAspires(e) {
      // // Clear filter/pill if default Category selected
      // if (e.currentTarget.value) {
      //   setAspires(e.currentTarget.value);
      //   return;
      // }

      // setAspires(e.currentTarget.value);
      // let pill = setNewPill(
      //   pillTypes.Aspires,
      //   `Aspires : ${e.currentTarget.innerText}`,
      //   e.currentTarget.value
      // );
      // sendFilter(FilterActions.setAspires, pill);

      CheckSelectedItem(
        e.currentTarget,
        aspires,
        setAspires,
        pillTypes.Aspires
      );
    }

    function onClickScore(e) {
      let target = e.target;
      let pill = setNewPill(
        pillTypes.Rating,
        `${category.label} : ${target.innerText}`,
        {category: category.category, score: target.value }
      );
      sendFilter(FilterActions.setRatingScore, pill);
    }

    useEffect(() => {
      OnChangeSubmit();
    }, [filterState]);

    useEffect(() => {
      setYearRange(getYearRange());
    }, [yearsOptionRange]);

    useEffect(() => {
      if (filterInstitutionValue && filterInstitutionValue.length >= 2) {
        let filterInstitutions = institutions.filter((n) =>
          n.text.toLowerCase().includes(filterInstitutionValue.toLowerCase())
        );
        setFilteredInstitutions(filterInstitutions);
        return;
      }
      // unfilter and show all institutions from state
      setFilteredInstitutions(institutions);
    }, [filterInstitutionValue]);

    const modifiers = [
      {
        name: 'setMaxHeight',
        enabled: true,
        order: 890,
        fn: (data) => {
          return {
            ...data,
            styles: {
              ...data.styles,
              overflow: "auto",
              maxHeight: "300px",
              vw: "500px",
            },
          };
        },
      },
    ];
    
    // const modifiers = {
    //   setMaxHeight: {
    //     enabled: true,
    //     order: 890,
    //     fn: (data) => {
    //       return {
    //         ...data,
    //         styles: {
    //           ...data.styles,
    //           overflow: "auto",
    //           maxHeight: "300px",
    //           vw: "500px",
    //         },
    //       };
    //     },
    //   },
    // };

    return (
      <div className="d-flex flex-column container-fluid" >
          <div className="row filters-form-container">
            <div className="col-sm-12 col-md-6 col-lg-3">
              <Searching
                onSearchValueChange={NameSearch_OnChange}
                value={nameSearch}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-2">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    Positions
                  </DropdownToggle>
                  <DropdownMenu
                    modifiers={modifiers}
                    right
                    className="btn-dropdown-items"
                  >
                    {Object.keys(positions).length !== 0
                      ? positions.map((positionElement, index) => {
                          return positionElement.checked ? (
                            ""
                          ) : (
                            <div key={index} className="filter-select-item">
                              <Label>
                                <input
                                  type="checkbox"
                                  value={positionElement.value}
                                  name={positionElement.text}
                                  checked={positionElement.checked}
                                  onChange={(e) => {
                                    Position_OnChange(e);
                                  }}
                                />
                                {positionElement.text}
                              </Label>
                            </div>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>

            <div className="col-sm-6 col-md-5 col-lg-3">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    School Categories
                  </DropdownToggle>
                  <DropdownMenu
                    modifiers={modifiers}
                    right
                    className="btn-dropdown-items"
                  >
                    {Object.keys(schoolCategories).length !== 0
                      ? schoolCategories.map((schoolCategoryElement, index) => {
                          return schoolCategoryElement.checked ? (
                            ""
                          ) : (
                            <div key={index} className="filter-select-item">
                              <Label>
                                <input
                                  type="checkbox"
                                  name={schoolCategoryElement.text}
                                  value={schoolCategoryElement.value}
                                  checked={schoolCategoryElement.checked}
                                  onChange={(e) => {
                                    SchoolCategory_OnChange(e);
                                  }}
                                />
                                {schoolCategoryElement.text}
                              </Label>
                            </div>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            <div className="col-sm-6 col-md-7 col-lg-4">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    Schools
                  </DropdownToggle>
                  <DropdownMenu
                    modifiers={modifiers}
                    right
                    className="btn-dropdown-items"
                  >
                    <DropdownTypeAhead
                      value={filterInstitutionValue}
                      changeEvent={(e) => institutionFiltering(e.target.value)}
                      clearEvent={() => institutionFiltering("")}
                    />
                    {Object.keys(filteredInstitutions).length !== 0
                      ? filteredInstitutions.map((schoolElement, index) => {
                          return schoolElement.checked ? (
                            ""
                          ) : (
                            <div key={index} className="filter-select-item">
                              <Label>
                                <input
                                  type="checkbox"
                                  name={schoolElement.text}
                                  value={schoolElement.value}
                                  checked={schoolElement.checked}
                                  onChange={(e) => {
                                    Institution_Onchange(e);
                                  }}
                                />
                                {schoolElement.text}
                              </Label>
                            </div>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-2">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    Tenure
                  </DropdownToggle>
                  <DropdownMenu
                    modifiers={modifiers}
                    right
                    className="btn-dropdown-items"
                  >
                    {Object.keys(tenureRanges).length !== 0
                      ? tenureRanges.map((tenureElement, index) => {
                          return tenureElement.checked ? (
                            ""
                          ) : (
                            <div key={index} className="filter-select-item">
                              <Label>
                                <input
                                  type="checkbox"
                                  name={tenureElement.text}
                                  value={tenureElement.value}
                                  checked={tenureElement.checked}
                                  onChange={(e) => {
                                    Tenure_OnChange(e);
                                  }}
                                />
                                {tenureElement.text}
                              </Label>
                            </div>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            <div className="col-sm-6 col-md-7 col-lg-3">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    Degrees
                  </DropdownToggle>
                  <DropdownMenu
                    modifiers={modifiers}
                    right
                    className="btn-dropdown-items"
                  >
                    {Object.keys(degrees).length !== 0
                      ? degrees.map((degreeElement, index) => {
                          return degreeElement.checked ? (
                            ""
                          ) : (
                            <div key={index} className="filter-select-item">
                              <Label>
                                <input
                                  type="checkbox"
                                  name={degreeElement.text}
                                  value={degreeElement.value}
                                  checked={degreeElement.checked}
                                  onChange={(e) => {
                                    Degree_OnChange(e);
                                  }}
                                />
                                {degreeElement.text}
                              </Label>
                            </div>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            <div className="col-sm-6 col-md-7 col-lg-4">
              <FormGroup>
                <UncontrolledDropdown setActiveFromChild>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    {category.label || "Performance Domain"}
                  </DropdownToggle>
                  <DropdownMenu modifiers={modifiers} persist={false}>
                  <DropdownItem header>T-PESS</DropdownItem>
                    {Object.keys(categories).length !== 0
                      ? categories.map((catElement, index) => {
                          return (
                            <DropdownItem
                              key={"cat-" + index}
                              onClick={onClickCategory}
                              value={catElement.value}
                              active={catElement.selected}
                            >
                              {catElement.text}
                            </DropdownItem>
                          );
                        })
                      : ""}
                      <DropdownItem divider />
                      <DropdownItem header>Readiness</DropdownItem>
                      {Object.keys(otherCategories).length !== 0
                      ? otherCategories.map((catElement, index) => {
                          return (
                            <DropdownItem
                              key={"cat-" + index}
                              onClick={onClickCategory}
                              value={catElement.value}
                              active={catElement.selected}
                            >
                              {catElement.text}
                            </DropdownItem>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-3">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                    disabled={category.label === ""}
                  >
                    Score
                  </DropdownToggle>
                  <DropdownMenu modifiers={modifiers} right>
                    <DropdownItem
                      value="-1"
                      key={"score-0"}
                      onClick={onClickScore}
                    >
                      All Scores
                    </DropdownItem>
                    {Object.keys(SCORE_OPTIONS).length !== 0
                      ? SCORE_OPTIONS.map((score, index) => {
                          return (
                            <DropdownItem
                              key={"score-" + index}
                              onClick={onClickScore}
                              value={score.value}
                              active={score.selected}
                            >
                              {score.text}
                            </DropdownItem>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-3">
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="form-group-filter-with-label btn-dropdown"
                    caret
                  >
                    Aspires Next Role
                  </DropdownToggle>
                  <DropdownMenu modifiers={modifiers} right>                     
                  {Object.keys(aspires).length !== 0
                      ? aspires.map((aspiresElement, index) => {
                          return aspiresElement.checked ? (
                            ""
                          ) : (
                            <div key={index} className="filter-select-item">
                              <Label>
                                <input
                                  type="checkbox"
                                  value={aspiresElement.value}
                                  name={aspiresElement.text}
                                  checked={aspiresElement.checked}
                                  onChange={onClickAspires}
                                />
                                {aspiresElement.text}
                              </Label>
                            </div>
                          );
                        })
                      : ""}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </div>
            
          </div>
        <PillsFilters
          handleRemove={removePillAndFilter}
          handleRemoveAll={removeAllPills}
        />
      </div>
    );
  }

  return <div className="w-100">{RenderFilters()}</div>;
};

const DirectoryFilters = (props) => <CreateDirectoryFilters {...props} />;

export default DirectoryFilters;
