import React, { useEffect, useRef } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Searching from './Searching';
import UseDirectoryFilters from './UseDirectoryFilter';
import DropdownTypeAhead from './DropdownTypeAhead';
import PillsFilters from './PillsComponents/PillsFilters';
import UsePills from './PillsComponents/UsePills';
import { useFilterContext } from "../../context/filters/UseFilterContext";
import FilterActions from "../../context/filters/FilterActions";
import { SCORE_OPTIONS, TENURE_RANGES} from '../../utils/Constants';

const CreateDirectoryFilters = (props) => {

    function RenderFilters(data) {
        const {positions, setPositions, nameSearch, setNameSearch, 
            degrees, setDegrees,
            yearsOptionRange, setYearsOptionRange, year, setYear,
            setYearRange, institutions, setInstitutions,
            filteredInstitutions, setFilteredInstitutions,
            filterInstitutionValue, setFilterInstitutionValue,
            tenureRanges, setTenureRanges,
            setCheckValueForElement, unCheckAllFromElement,
            categories
        } = UseDirectoryFilters();
        
        const { setNewPill, removePill, pillTypes, getTypeAction } = UsePills();
        const [filterState, sendFilter] = useFilterContext();

        function CheckSelectedItem(target, elements, setter, type) {
            setCheckValueForElement(elements, setter,  target.value, target.checked);
            setCheckedFilterAsPill(type, target);
        }

        function setCheckedFilterAsPill(filterType, target){
            let action = getTypeAction(filterType, target.checked);
            let pill = setNewPill(filterType, target.name, parseInt(target.value))
            sendFilter(action, pill);
        }

        function GetCheckedOrSelectedValues(elements) {
            return elements?.filter(x => x.checked || x.selected).map(x => x.value) ?? [];
        }

        function OnChangeSubmit(isClearing){
            let selectedTenureRanges =  getYearRange(filterState.tenure)

            let filters = {
                "Assignments":{
                    "Values": filterState.positions
                },
                "Degrees":{
                    "Values": filterState.degrees
                },
                "Name": filterState.nameSearch,
                "MinYears": 0,
                "MaxYears": 0,
                "Institutions":{
                    "Values": filterState.institutions
                },
                "Ratings": {
                    "CategoryId": filterState.categoryId,
                    "Score": filterState.score
                },
                "TenureRanges":{
                    "Values": selectedTenureRanges
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

        function Tenure_OnChange(e)
        {
            CheckSelectedItem(e.currentTarget, tenureRanges, setTenureRanges, pillTypes.Tenure);
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
                setCheckValueForElement(tenureRanges, setTenureRanges, pill.value, false);
            }

            sendFilter(getTypeAction(pill.filter, false), pill);
            OnChangeSubmit();
        }

        function removeAllPills(){
            sendFilter(FilterActions.clearFilters);
            unCheckAllFromElement(positions, setPositions);
            unCheckAllFromElement(degrees, setDegrees);
            unCheckAllFromElement(filteredInstitutions, setFilteredInstitutions);
            setYear('');
            OnChangeSubmit(true);
        }

        function getYearRange(tenureOptions){
            let ranges = [];

            if(typeof(tenureOptions) !=='undefined')
            {
                tenureOptions.forEach(option => {
                    ranges.push(TENURE_RANGES[option]);
                });
                // if (tenureOptions.includes(0)) {
                //     range.push({min:0, max:2});
                // }
    
                // if (tenureOptions.includes(1)) {
                //     range.push({min:3, max:5});
                // }
    
                // if (tenureOptions.includes(2)) {
                //     range.push({min:6, max:10});
                // }
    
                // if (tenureOptions.includes(3)) {
                //     range.push({min:11, max:15});
                // }
    
                // if (tenureOptions.includes(4)) {
                //     range.push({min:15, max:100});
                // }
            }
            return ranges;
        }

        function onClickCategory(e){
            // Clear filter/pill if default Category selected 
            if(e.currentTarget.value == 0){
                var ratingPill = filterState.pills.find(value => value.filter === pillTypes.Rating);
                sendFilter(FilterActions.removeRating, ratingPill);
                return;
            }
            sendFilter(FilterActions.setRatingCategory, {text: e.currentTarget.innerText, value: e.currentTarget.value});
        }

        function onClickScore(e){
            let target = e.target;
            let pill = setNewPill(pillTypes.Rating, `${filterState.categoryLabel} : ${target.innerText}`, target.value)
            sendFilter(FilterActions.setRatingScore, pill);
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
                               <UncontrolledDropdown>
                                   <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                       Tenure
                                   </DropdownToggle>
                                   <DropdownMenu modifiers={modifiers} right className="btn-dropdown-items">
                                       {
                                           Object.keys(tenureRanges).length !== 0 ? (
                                            tenureRanges.map((tenureElement, index) => 
                                               {
                                                   return(
                                                       <div key={index}>
                                                           <input type="checkbox"
                                                           style={{"display": "inline"}}
                                                           name={tenureElement.text}
                                                           value={tenureElement.value}
                                                           checked={tenureElement.checked}
                                                           onChange={e => {Tenure_OnChange(e)}} />
                                                        <Label style={{"display": "inline"}}>{tenureElement.text}</Label></div>)
                                               })
                                            ) : ("")
                                       }

                                   </DropdownMenu>
                               </UncontrolledDropdown>
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
                    <Row className="centered-filter-rows">
                        <Col md={3} lg={3} xl={3}>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <UncontrolledDropdown setActiveFromChild>
                                    <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret>
                                        {filterState.categoryLabel || "Performance Indicator"}
                                    </DropdownToggle>
                                    <DropdownMenu modifiers={modifiers} persist={false}>
                                        <DropdownItem value="0" key={"cat-0"} onClick={onClickCategory}>All Performance Indicators</DropdownItem>
                                        <DropdownItem divider/>
                                        {
                                            Object.keys(categories).length !== 0 ? (
                                                categories.map((catElement, index) => {
                                                    return(
                                                        <DropdownItem key={"cat-" + index} onClick={onClickCategory} value={catElement.value} active={catElement.selected}>
                                                            {catElement.text}
                                                        </DropdownItem>
                                                    )
                                                })
                                            ): ("")
                                        }
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </FormGroup>
                        </Col>
                        <Col md={3} lg={3} xl={3}>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <UncontrolledDropdown >
                                    <DropdownToggle className="form-group-filter-with-label btn-dropdown" caret disabled={filterState.categoryId == 0}>
                                        Score
                                    </DropdownToggle>
                                    <DropdownMenu modifiers={modifiers} right>
                                        <DropdownItem value="0" key={"score-0"} onClick={onClickScore}>All Scores</DropdownItem>
                                        {
                                            Object.keys(SCORE_OPTIONS).length !== 0 ? (
                                                SCORE_OPTIONS.map((score, index) => {
                                                    return(
                                                        <DropdownItem key={"score-" + index} onClick={onClickScore} value={score.value} active={score.selected}>
                                                            {score.text}
                                                        </DropdownItem>
                                                    )
                                                })
                                            ): ("")
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
