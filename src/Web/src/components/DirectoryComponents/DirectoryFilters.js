import React from 'react';
import { Form, FormGroup, Label, Input, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Searching from './Searching';
import { FilterIcon } from '../Icons';
import UseDirectoryFilters from './UseDirectoryFilter';

const CreateDirectoryFilters = (props) => {

    function RenderFilters(data) {
        const {positions, setPositions} = UseDirectoryFilters();

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

        function Position_OnChange(e){
            CheckSelectedItem(e, positions, setPositions);
            OnChangeSubmit();
        }

        function OnChangeSubmit(){
            let selectedPositions = GetCheckedOrSelectedValues(positions);

            let filters = {
                "Assignments":{
                    "Values": selectedPositions
                }
            }

            props.directoryFilteredSearchCallback(filters);
        }

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
                <div className="filters-container">
                    <Form>
                    <Row>
                        <Col className="filter-select-with-label">
                        <FormGroup className="mb-2 mt-7 mr-sm-2 mb-sm-0 form-group-filter-with-label">
                            <Label for="districtSelect" className="mr-sm-2">
                                <FilterIcon />
                                <span className="filter-title">Filter by</span>
                            </Label>
                            <Input disabled type="select" name="select" id="districtSelect" className="filter-dropdown-sm">
                                <option>District - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        </Col>
                        <Col>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input  type="select" name="select" className="filter-dropdown">
                                <option>School - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
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
                            <Input disabled type="select" name="select" className="filter-dropdown">
                                <option>Years of Service - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input disabled type="select" name="select" className="filter-dropdown">
                                <option>Degree - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        </Col>
                    </Row>
                    </Form>
                </div>

                <div className="search-sort-container">
                    <Form className="search-sort-form">
                        <Searching />
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
