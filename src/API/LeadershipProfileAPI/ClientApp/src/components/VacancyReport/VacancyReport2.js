import React, { useState } from 'react';

import { Button } from 'reactstrap';
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';


import { TableViewIcon, CardViewIcon } from '../Icons';
import BreadcrumbList from '../Breadcrumb';
// import CardList from './CardListComponents/CardList';
// import UseLandingPage from './UseLandingPage';

const VacancyReport = () => {
    const [activeComponent, setActiveComponent] = useState("table");
    // const { setColumnSort, sort, data, exportData, paging, setPage, error, setFilters, exportResults, buttonRef } = UseDirectory();
    
    // const callbackFilteredSearch = (searchData) => {
    //     setFilters(searchData);
    // }
    
    return (
        <div className="d-flex container-fluid flex-column"> 
            <div className='directory-div'>
                <div className="directory-subtitle-controls">
                    <div></div>
                    <div className="view-style-buttons">
                        <span className="view-style-label">View Style</span>
                        <button disabled={activeComponent === "table"} color="primary" className="btn btn-primary view-style-button-first view-style-button" onClick={() => setActiveComponent("table")}>
                            <TableViewIcon />
                        </button>
                        <button disabled={activeComponent === "card"} color="primary" className="btn btn-primary view-style-button" onClick={() => setActiveComponent("card")}>
                            <CardViewIcon />
                        </button>
                    </div>
                </div>
                <h2 className='directory-title'>Forecast Vacancies</h2>
            </div>
            
            <Table className='mt-4'>
        <thead>
          <tr>
            <th>#</th>
            <th>Campus</th>
            <th>Name</th>
            <th>Campus Rating</th>
            <th>Leave Date</th>
            <th>Gender</th>
            <th>Race</th>
            <th>Performance Rating</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr> */}
        </tbody>
      </Table>


      <Card
    className="my-2"
    color="primary"
    outline
    style={{
      width: '18rem'
    }}
  >
    <CardHeader>
      Start year 2019 - 2022
    </CardHeader>
    <CardBody>
    <Table className='mt-4'>
        <tbody>
          <tr>
            <th scope="row">School - Johnson Elementary</th>
          </tr>
          <tr>
          <th scope="row">School - Edify Middle School</th>
          </tr>
          <tr>
          <th scope="row">School - Vue High School</th>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
            
            <div>
                {/* <a className="selected-filters-clear mx-3" onClick={() => exportResults()}>Export Results</a> */}
            </div>
            {/* <Button className="selected-filters-clear mx-3" onClick={() => exportResults()}>Export Results</Button> */}


        </div>
    );
}

export default VacancyReport;
