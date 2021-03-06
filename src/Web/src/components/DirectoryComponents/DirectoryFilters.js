import React from 'react';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import Searching from './Searching';
import { FilterIcon } from '../Icons';

const CreateDirectoryFilters = (props) => {
    function RenderFilters(data) {
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
                            <Input disabled type="select" name="select" className="filter-dropdown">
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
                            <Input disabled type="select" name="select" className="filter-dropdown">
                                <option>Position - All</option>
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

const DirectoryFilters = () => (
    <CreateDirectoryFilters />
);

export default DirectoryFilters;
