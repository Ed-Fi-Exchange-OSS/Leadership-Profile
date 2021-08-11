import React, { useEffect, useRef } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, Button } from 'reactstrap';
import Searching from './Searching';
import { FilterIcon } from '../Icons';
import UseDirectoryFilters from './UseDirectoryFilter';
import DropdownTypeAhead from './DropdownTypeAhead';

const CreateDirectoryFilters = (props) => {

    function RenderFilters(data) {
        const {positions, setPositions, nameSearch, setNameSearch, 
            degrees, setDegrees, certifications, setCertifications,
            yearsOptionRange, setYearsOptionRange, year, setYear,
            yearRange, setYearRange, institutions, setInstitutions,
            filteredInstitutions, setFilteredInstitutions,
            filterInstitutionValue, setFilterInstitutionValue
        } = UseDirectoryFilters();
        const isInitialRender = useRef(true);

        function CheckSelectedItem(e, elements, setter) {
            let newElements = [...elements];
            newElements.forEach((element) => {
                if (element.value == e.currentTarget.value) {
                    element.checked = e.currentTarget.checked;
                }
            });
            setter(newElements);
        }

        function GetCheckedOrSelectedValues(elements) {
            return elements?.filter(x => x.checked || x.selected).map(x => x.value) ?? [];
        }

        function OnChangeSubmit(){
            let selectedPositions = GetCheckedOrSelectedValues(positions);
            let selectedDegrees = GetCheckedOrSelectedValues(degrees);
            let selectedCertificates = GetCheckedOrSelectedValues(certifications);
            let selectedInstitutions = GetCheckedOrSelectedValues(institutions);
            let filters = {
                "Assignments":{
                    "Values": selectedPositions
                },
                "Degrees":{
                    "Values": selectedDegrees
                },
                "Certifications":{
                    "Values": selectedCertificates
                },
                "Name": nameSearch,
                "MinYears": yearRange.min,
                "MaxYears": yearRange.max,
                "Institutions":{
                    "Values": selectedInstitutions
                }
            }

            props.directoryFilteredSearchCallback(filters);
        }
        
        function Position_OnChange(e){
            CheckSelectedItem(e, positions, setPositions);
            OnChangeSubmit();
        }

        function NameSearch_OnChange(value){
            setNameSearch(value);
        }

        function Degree_OnChange(e){
            CheckSelectedItem(e, degrees, setDegrees);
            OnChangeSubmit();
        }

        function Certification_OnChange(e){
            CheckSelectedItem(e, certifications, setCertifications);
            OnChangeSubmit();
        }

        function YearOption_OnChange(value){
            setYearsOptionRange(value);
        }

        function Year_OnChange(value){
            setYear(value);

            if(yearsOptionRange == 0){
                let atLeast = {
                    min: value,
                    max: 0
                };
                setYearRange(atLeast);
            }

            if(yearsOptionRange == 1){
                let lessThan = {
                    min: 0,
                    max: value
                };
                setYearRange(lessThan);
            }
        }

        function Institution_Onchange(e){
            CheckSelectedItem(e, filteredInstitutions, setFilteredInstitutions);
            OnChangeSubmit();
        }

        function institutionFiltering(value){
            setFilterInstitutionValue(value);
        }

        useEffect(() => {

            if(isInitialRender.current){
                isInitialRender.current = false;
                return;
            }

            OnChangeSubmit();
        }, [nameSearch])

        useEffect(() => {
            if(isInitialRender.current){
                isInitialRender.current = false;
                return;
            }
            OnChangeSubmit();
        }, [yearRange])

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
                <div className="filters-container col-12">
                    <Form>
                    <Row>
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
                                                           name="desc1" 
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
                               <UncontrolledDropdown>
                                   <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                       Select Position
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
                                                           name="desc1" 
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
                                       Select Degree
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
                                                           name="desc1" 
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
                                <Input disabled={yearsOptionRange < 0} type="number" min="0" step="1" value={year} placeholder="Years"
                                onChange={event => {Year_OnChange(event.target.value);}} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <UncontrolledDropdown>
                                   <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                       Select Certifications
                                   </DropdownToggle>
                                   <DropdownMenu modifiers={modifiers} right className="btn-dropdown-items">
                                       {
                                           Object.keys(certifications).length !== 0 ? (
                                               certifications.map((positionElement, index) => 
                                               {
                                                   return(
                                                       <div key={index}>
                                                           <input type="checkbox"
                                                           style={{"display": "inline"}}
                                                           name="desc1" 
                                                           value={positionElement.value}
                                                           checked={positionElement.checked}
                                                           onChange={e => {Certification_OnChange(e)}} />
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

                <div className="search-sort-container">
                    <div className="search-sort-form">
                        <Searching onSearchValueChange = {NameSearch_OnChange}/>
                        <div className="sorting-container">
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0 sort-by-form-group">
                                <Label for="sortBy" className="mr-sm-2">
                                    <FilterIcon />
                                    <span className="filter-title">Sort by</span>
                                </Label>
                                <Input disabled type="select" name="select" id="sort-by">
                                    <option>A - B</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="experience-sort">
                                <Input disabled type="select" name="select" id="experience">
                                    <option>Most experience</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
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
