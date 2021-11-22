import React, { useState } from 'react';
import { TableViewIcon, CardViewIcon } from '../Icons';
import BreadcrumbList from '../Breadcrumb';
import TableList from './TableList';
import CardList from './CardListComponents/CardList';
import UseDirectory from './UseDirectory';
import ErrorMessage from '../ErrorMessage';
import DirectoryFilters from './DirectoryFilters';

const Directory = () => {
    const [activeComponent, setActiveComponent] = useState("table");
    const { setColumnSort, sort, data, paging, setPage, error, setFilters } = UseDirectory();
    
    const callbackFilteredSearch = (searchData) => {
        setFilters(searchData);
    }
    
    return (
        <div className="d-flex container-fluid flex-column"> 
            <div className='directory-div'>
                <div className="directory-subtitle-controls">
                    <div></div>
                    <div className="view-style-buttons">
                        <span className="view-style-label">View Style</span>
                        <button disabled={activeComponent == "table"} color="primary" className="btn btn-primary view-style-button-first view-style-button" onClick={() => setActiveComponent("table")}>
                            <TableViewIcon />
                        </button>
                        <button disabled={activeComponent == "card"} color="primary" className="btn btn-primary view-style-button" onClick={() => setActiveComponent("card")}>
                            <CardViewIcon />
                        </button>
                    </div>
                </div>
                <h2 className='directory-title'>Directory</h2>
                <DirectoryFilters directoryFilteredSearchCallback = {callbackFilteredSearch}/>
            </div>
            
            { error ? <ErrorMessage /> : '' }
            { activeComponent === "table" ? (
                <TableList sort={sort} data={data} setColumnSort={setColumnSort} paging={paging} setPage={setPage} />
            ) : activeComponent === "card" ? (
                <CardList data={data} paging={paging} setPage={setPage} />
            ) : null (
                <div />
            )}
        </div>
    );
}

export default Directory;
