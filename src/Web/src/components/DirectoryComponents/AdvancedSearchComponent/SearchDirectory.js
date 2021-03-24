import React, { useState } from 'react';
import { TableViewIcon, CardViewIcon } from '../../Icons';
import BreadcrumbList from '../../Breadcrumb';
import TableList from './../TableList';
import CardList from './../CardListComponents/CardList';
import UseSearchDirectory from './UseSearchDirectory';
import ErrorMessage from '../../ErrorMessage';
import AdvancedSearch from './AdvancedSearch';

const SearchDirectory = () => {
    const [activeComponent, setActiveComponent] = useState("table");
    const { setColumnSort, sort, data, paging, setPage, search, setSearchValue, error } = UseSearchDirectory();
    return (
        <div>
            <div className='directory-div'>
                <h2 className=''>Search Directory</h2>
                <div className="directory-subtitle-controls">
                    <BreadcrumbList currentPage="home" />
                    <div className="view-style-buttons">
                        <button color="primary" className="btn btn-primary view-style-button-first view-style-button" onClick={() => setActiveComponent("table")}>
                            <TableViewIcon />
                        </button>
                        <button  color="primary" className="btn btn-primary view-style-button" onClick={() => setActiveComponent("card")}>
                            <CardViewIcon />
                        </button>
                    </div>
                </div>
            </div>
            <AdvancedSearch/>
            <br/>
            { error ? <ErrorMessage /> : '' }
            { activeComponent === "table" ? (
                <TableList sort={sort} data={data} setColumnSort={setColumnSort} paging={paging} setPage={setPage} />
            ) : activeComponent === "card" ? (
                <CardList data={data}/>
            ) : null (
                <div />
            )}
        </div>
    );
}

export default SearchDirectory;
