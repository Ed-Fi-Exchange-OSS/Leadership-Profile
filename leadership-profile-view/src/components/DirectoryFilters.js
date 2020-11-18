import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FilterIcon, SearchIcon } from './Icons';

class DirectoryFilters extends Component {
    render() {
        return (
            <div>
                <div className="filters-container">
                    <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="exampleSelect" className="mr-sm-2">
                                <FilterIcon />
                                Filter by
                            </Label>
                            <Input type="select" name="select" id="exampleSelect">
                                <option>District - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input type="select" name="select" id="exampleSelect">
                                <option>School - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input type="select" name="select" id="exampleSelect">
                                <option>Position - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input type="select" name="select" id="exampleSelect">
                                <option>Years of Service - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input type="select" name="select" id="exampleSelect">
                                <option>Degree - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </div>
                
                <div className="search-sort-container">
                    <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <div>
                                <Input type="text" name="searchByName" placeholder="Search by name" />
                                <SearchIcon />
                            </div>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Input type="select" name="select" id="exampleSelect">
                                <option>Degree - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>                        
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="sortBy" className="mr-sm-2">
                                <FilterIcon />
                                Sort by
                            </Label>
                            <Input type="select" name="select" id="sortBy">
                                <option>A - B</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="select" name="select" id="experience">
                                <option>Most experience</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        );
    }
  }

  export default DirectoryFilters;
