import React, { useEffect, useRef } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, Button } from 'reactstrap';
import Searching from './Searching';
import UseDirectoryFilters from './UseDirectoryFilter';
import DropdownTypeAhead from './DropdownTypeAhead';
import PillsFilters from './PillsComponents/PillsFilters';
import UsePills from './PillsComponents/UsePills';
import { useFilterContext } from "../../context/filters/UseFilterContext";
import FilterActions from "../../context/filters/FilterActions";

const CreateDirectoryFilters = (props) => {

    function RenderFilters(data) {
        const {positions, setPositions, nameSearch, setNameSearch, 
            degrees, setDegrees,
            yearsOptionRange, setYearsOptionRange, year, setYear,
            setYearRange, institutions, setInstitutions,
            filteredInstitutions, setFilteredInstitutions,
            filterInstitutionValue, setFilterInstitutionValue,
            setCheckValueForElement, unCheckAllFromElement
        } = UseDirectoryFilters();
        
        const { setNewPill, removePill, pillTypes, getTypeAction } = UsePills();
        const [filterState, sendFilter] = useFilterContext();

        function CheckSelectedItem(target, elements, setter, type) {
            setCheckValueForElement(elements, setter,  target.value, target.checked);
            setCheckedFilterAsPill(type, target);
        }

        function setCheckedFilterAsPill(filterType, target){
            debugger;
            let action = getTypeAction(filterType, target.checked);
            let pill = setNewPill(filterType, target.name, parseInt(target.value))
            sendFilter(action, pill);
        }

        function OnChangeSubmit(isClearing){
            let yearsOnRange = getYearRange(isClearing);
            let filters = {
                "Assignments":{
                    "Values": filterState.positions
                },
                "Degrees":{
                    "Values": filterState.degrees
                },
                "Name": filterState.nameSearch,
                "MinYears": yearsOnRange.min,
                "MaxYears": yearsOnRange.max,
                "Institutions":{
                    "Values": filterState.institutions
                }
            }

            props.directoryFilteredSearchCallback(filters);
        }
        
        function Position_OnChange(e){
            CheckSelectedItem(e.currentTarget, positions, setPositions, pillTypes.Position);
        }

        function NameSearch_OnChange(value){
            setNameSearch(value);
            if(value.length >= 3 || value.length === 0){
                sendFilter(FilterActions.setNameFilter, value);
            }
        }

        function Degree_OnChange(e){
            CheckSelectedItem(e.currentTarget, degrees, setDegrees, pillTypes.Degree);
        }

        function YearOption_OnChange(value){
            setYearsOptionRange(value); 
        }

        function Year_OnChange(value){
            setYear(value);
        }

        function Institution_Onchange(e){
            CheckSelectedItem(e.currentTarget, filteredInstitutions, setFilteredInstitutions, pillTypes.Institution);
        }

        function institutionFiltering(value){
            setFilterInstitutionValue(value);
        }

        function removePillAndFilter(pill){
            if(pill.filter === pillTypes.Position){
                setCheckValueForElement(positions, setPositions, pill.value, false);
            }
            if(pill.filter === pillTypes.Degree){
                setCheckValueForElement(degrees, setDegrees, pill.value, false);
            }
            if(pill.filter === pillTypes.Institution){
                setCheckValueForElement(filteredInstitutions, setFilteredInstitutions, pill.value, false);
            }
            if(pill.filter === pillTypes.Tenure){
                setYear('');
                removePill(pill);
            }

            sendFilter(getTypeAction(pill.filter, false), pill);

            if(pill.filter !== pillTypes.Tenure) OnChangeSubmit();
        }

        function removeAllPills(){
            sendFilter(FilterActions.clearFilters);
            unCheckAllFromElement(positions, setPositions);
            unCheckAllFromElement(degrees, setDegrees);
            unCheckAllFromElement(filteredInstitutions, setFilteredInstitutions);
            setYearsOptionRange('-1');
            setYear('');
            OnChangeSubmit(true);
        }

        function getYearRange(clearing){
            if(yearsOptionRange < 0 || typeof(year)  === 'undefined' || year === '' || clearing) return {min:0, max:0};

            if(yearsOptionRange == 0 && year){
                let atLeast = {
                    min: year,
                    max: 0
                };
                return atLeast;
            }

            if(yearsOptionRange == 1 && year){
                let lessThan = {
                    min: 0,
                    max: year
                };
                return lessThan;
            }
        }

        useEffect(() => {
            OnChangeSubmit();
        }, [filterState])

        useEffect(() => {
            setYearRange(getYearRange());
            
            if(yearsOptionRange < 0) return;

            if(typeof(year)  !== 'undefined' && year !== '') {
                removePill("Year");
         
                    yearsOptionRange == 0 ? setNewPill("Year", `At Least ${year} years`, year) 
                    : setNewPill("Year", `Less Than ${year} years`, year);
                

                OnChangeSubmit();
            }
        }, [year, yearsOptionRange])

        useEffect(() =>{
            if(filterInstitutionValue && filterInstitutionValue.length >= 2){
                let filterInstitutions = institutions.filter(n => n.text.toLowerCase().includes(filterInstitutionValue.toLowerCase()));
                setFilteredInstitutions(filterInstitutions);
                return;
            }
            // unfilter and show all institutions from state
            setFilteredInstitutions(institutions);

        }, [filterInstitutionValue])

        const modifiers ={
            setMaxHeight: {
                enabled: true,
                order: 890,
                fn: (data) => {
                return {
                    ...data,
                    styles: {
                    ...data.styles,
                    overflow: 'auto',
                    maxHeight: '300px',
                    vw: '500px',
                    },
                };
                },
            },
          };

        return (
            <div>
                <div className="search-sort-container">
                    <div className="search-sort-form">
                        <Searching onSearchValueChange = {NameSearch_OnChange} value={nameSearch}/>
                    </div>
                </div>

                <PillsFilters handleRemove={removePillAndFilter} handleRemoveAll={removeAllPills}/>

                <div className="filters-container col-12">
                    <Form>
                    <Row>
                        <Col>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                               <UncontrolledDropdown>
                                   <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                       Positions
                                   </DropdownToggle>
                                   <DropdownMenu modifiers={modifiers} right className="btn-dropdown-items">
                                       {
                                           Object.keys(positions).length !== 0 ? (
                                               positions.map((positionElement, index) => 
                                               {
                                                   return(
                                                       <div key={index}>
                                                           <input type="checkbox"
                                                           style={{"display": "inline"}}
                                                           name={positionElement.text}
                                                           value={positionElement.value}
                                                           checked={positionElement.checked}
                                                           onChange={e => {Position_OnChange(e)}} />
                                                        <Label style={{"display": "inline"}}>{positionElement.text}</Label></div>)
                                               })
                                            ) : ("")
                                       }

                                   </DropdownMenu>
                               </UncontrolledDropdown>
                        </FormGroup>
                        </Col>
                        <Col>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <UncontrolledDropdown>
                                   <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                       Schools
                                   </DropdownToggle>
                                   <DropdownMenu modifiers={modifiers} right className="btn-dropdown-items">
                                       <DropdownTypeAhead 
                                            value={filterInstitutionValue} 
                                            changeEvent={(e) => institutionFiltering(e.target.value)} 
                                            clearEvent={() => institutionFiltering('')} />
                                       {
                                           Object.keys(filteredInstitutions).length !== 0 ? (
                                               filteredInstitutions.map((positionElement, index) => 
                                               {
                                                   return(
                                                       <div key={index}>
                                                           <input type="checkbox"
                                                           style={{"display": "inline"}}
                                                           name={positionElement.text}
                                                           value={positionElement.value}
                                                           checked={positionElement.checked}
                                                           onChange={e => {Institution_Onchange(e)}} />
                                                        <Label style={{"display": "inline"}}>{positionElement.text}</Label></div>)
                                               })
                                            ) : ("")
                                       }

                                   </DropdownMenu>
                               </UncontrolledDropdown>
                        </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Input type="select" name="select" className="filter-dropdown" value={yearsOptionRange}
                                onChange={event => {YearOption_OnChange(event.currentTarget.value);}} >
                                    <option value="-1">Years</option>
                                    <option value="0">At Least</option>
                                    <option value="1">Less Than</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Input disabled={yearsOptionRange < 0} type="number" min="0" step="1" value={year || ''} placeholder="Years"
                                onChange={event => {Year_OnChange(event.target.value);}} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <UncontrolledDropdown>
                                   <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                       Degrees
                                   </DropdownToggle>
                                   <DropdownMenu modifiers={modifiers} right className="btn-dropdown-items">
                                       {
                                           
                                           Object.keys(degrees).length !== 0 ? (
                                               degrees.map((positionElement, index) => 
                                               {
                                                   return(
                                                       <div key={index}>
                                                           <input type="checkbox"
                                                           style={{"display": "inline"}}
                                                           name={positionElement.text}
                                                           value={positionElement.value}
                                                           checked={positionElement.checked}
                                                           onChange={e => {Degree_OnChange(e)}} />
                                                        <Label style={{"display": "inline"}}>{positionElement.text}</Label></div>)
                                               })
                                            ) : ("")
                                       }
                                   </DropdownMenu>
                               </UncontrolledDropdown>
                        </FormGroup>
                        </Col>
                    </Row>
                    </Form>
                </div>
            </div>
        );
    }

    return (
        <div>
            {RenderFilters()}
        </div>
    );
}

const DirectoryFilters = (props) => (
    <CreateDirectoryFilters {...props}/>
);

export default DirectoryFilters;
