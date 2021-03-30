import React, { useState } from 'react';
import { TableViewIcon, CardViewIcon } from '../Icons';
import BreadcrumbList from '../Breadcrumb';
import DirectoryFilters from './DirectoryFilters';
import TableList from './TableList';
import CardList from './CardListComponents/CardList';
import UseDirectory from './UseDirectory';
import ErrorMessage from '../ErrorMessage';

const Directory = () => {
    const [activeComponent, setActiveComponent] = useState("table");
    const { setColumnSort, sort, data, paging, setPage, search, setSearchValue, error, goToAdvancedSearch } = UseDirectory();
    
    const handleOnClick = (e) => {
        e.preventDefault();
        goToAdvancedSearch();
    };
    
    return (
        <div>
            <div className='directory-div'>
                <h2 className='directory-title'>Directory</h2>
                <div className="directory-subtitle-controls">
                    <BreadcrumbList currentPage="home" />
                    <div className="view-style-buttons">
                        <a href="#"className="login-submit" onClick={e => handleOnClick(e)}>Advanced Search</a>
                        <button color="primary" className="btn btn-primary view-style-button-first view-style-button" onClick={() => setActiveComponent("table")}>
                            <TableViewIcon />
                        </button>
                        <button  color="primary" className="btn btn-primary view-style-button" onClick={() => setActiveComponent("card")}>
                            <CardViewIcon />
                        </button>
                    </div>
                </div>
            </div>
            <DirectoryFilters search={search} setSearchValue={setSearchValue} />
            
            { error ? <ErrorMessage /> : '' }
            { activeComponent === "table" ? (
                <TableList sort={sort} data={data} setColumnSort={setColumnSort} paging={paging} setPage={setPage} />
            ) : activeComponent === "card" ? (
                <CardList data={data} />
            ) : null (
                <div />
            )}
        </div>
    );
}

export default Directory;
