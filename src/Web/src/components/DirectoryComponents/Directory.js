import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { TableViewIcon, CardViewIcon } from '../Icons';
import BreadcrumbList from '../Breadcrumb';
import DirectoryFilters from './FiltersComponents/DirectoryFilters';
import TableList from './TableListComponents/TableList';
import CardList from './CardListComponents/CardList';

const Directory = () => {
    const [activeComponent, setActiveComponent] = useState("table");

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
        </div>
    );
}

export default Directory;
