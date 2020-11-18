import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class DirectoryFilters extends Component {
    render() {
        return (
            <div>
                <div className="filters-container">
                    <Form inline>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="exampleSelect" className="mr-sm-2">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-funnel-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                                </svg>
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
                            <Input type="text" name="searchByName" placeholder="Search by name" /> 
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
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-funnel-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                                </svg>
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
