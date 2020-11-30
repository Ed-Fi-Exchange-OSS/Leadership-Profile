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
    const { paging, setPage } = UseDirectory(); 
    const { setColumnSort, setSort, sort, data, paging, setPage, search, setSearchValue } = UseDirectory();

    return (
        <div>
            <div className='directory-div'>
                <h2>Directory</h2>
                <div className="directory-subtitle-controls">
                    <BreadcrumbList />
                    <div className="view-style-buttons">
                        <span>View Style</span>
                        <Button color="primary" onClick={() => setActiveComponent("table")}>
                            <TableViewIcon />
                        </Button>
                        <Button color="primary" onClick={() => setActiveComponent("card")}>
                            <CardViewIcon />
                        </Button>
                    </div>
                </div>
            </div>
            <DirectoryFilters />
            { activeComponent === "table" ? (
                <TableList/>
            ) : activeComponent === "card" ? (
                <CardList />
            ) : null (
                <div />
            )}
            <PaginationButtons paging={paging} setPage={setPage} />
        </div>
    );
}

export default Directory;
