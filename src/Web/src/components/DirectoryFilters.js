import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FilterIcon, SearchIcon } from './Icons';

class DirectoryFilters extends Component {
    render() {
        return (
            <div>
                <div className="filters-container">
                    <Form className="filter-form">
                        <FormGroup className="mb-2 mt-7 mr-sm-2 mb-sm-0 filter-select-with-label">
                            <Label for="districtSelect" className="mr-sm-2">
                                <FilterIcon />
                                Filter by
                            </Label>
                            <Input type="select" name="select" id="districtSelect" className="filter-dropdown-sm">
                                <option>District - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 filter-select">
                            <Input type="select" name="select" className="filter-dropdown">
                                <option>School - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 filter-select">
                            <Input type="select" name="select" className="filter-dropdown">
                                <option>Position - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 filter-select">
                            <Input type="select" name="select" className="filter-dropdown">
                                <option>Years of Service - All</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 filter-select">
                            <Input type="select" name="select" className="filter-dropdown">
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
                    <Form className="search-sort-form">
                        <FormGroup className="w-50" className="search-by-name">
                            <Input type="text" name="searchByName" placeholder="Search by name" className="w-100" />
                            <SearchIcon stylingId="search-by-name-icon" />
                        </FormGroup>
                        <div className="sorting-container">
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0 sort-by">
                                <Label for="sortBy" className="mr-sm-2">
                                    <FilterIcon />
                                    Sort by
                                </Label>
                                <Input type="select" name="select" id="sort-by">
                                    <option>A - B</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="experience-sort">
                                <Input type="select" name="select" id="experience">
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
}

export default DirectoryFilters;
