import React, { useState } from 'react';
import { Button, Pagination } from 'reactstrap';
import { TableViewIcon, CardViewIcon } from '../Icons';
import BreadcrumbList from '../Breadcrumb';
import DirectoryFilters from './DirectoryFilters';
import TableList from './TableList';
import PaginationButtons from './PaginationButtons';
import CardList from './CardListComponents/CardList';
import UseDirectory from './UseDirectory';

const Directory = () => {
    const [activeComponent, setActiveComponent] = useState("table");
    const { setColumnSort, sort, data, paging, setPage, search, setSearchValue } = UseDirectory();

    return (
        <div>
            <div className='directory-div'>
                <h2 className='directory-title'>Directory</h2>
                <div className="directory-subtitle-controls">
                    <BreadcrumbList currentPage="home" />
                    <div className="view-style-buttons">
                        <span className="view-style-label">View Style</span>
                        <Button color="primary" className="view-style-button-first" onClick={() => setActiveComponent("table")}>
                            <TableViewIcon />
                        </Button>
                        <Button color="primary" onClick={() => setActiveComponent("card")}>
                            <CardViewIcon />
                        </Button>
                    </div>
                </div>
            </div>
            <DirectoryFilters search={search} setSearchValue={setSearchValue} />
            { activeComponent === "table" ? (
                <TableList sort={sort} data={data} setColumnSort={setColumnSort} paging={paging} setPage={setPage} />
            ) : activeComponent === "card" ? (
                <CardList />
            ) : null (
                <div />
            )}
        </div>
    );
}

export default Directory;
