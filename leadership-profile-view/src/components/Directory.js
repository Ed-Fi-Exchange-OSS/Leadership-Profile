import React, { Component, useState } from 'react';
import { Button } from 'reactstrap';
import { TableViewIcon, CardViewIcon } from './Icons';
import BreadcrumbList from './Breadcrumb';
import DirectoryFilters from './DirectoryFilters';
import TableList from './TableList';
import CardList from './CardList';

export default function Directory() {
    const [activeComponent, setActiveComponent] = useState("table");

    return (
        <div>
            <div className='directory-div'>
                <h2>Directory</h2>
                <BreadcrumbList />
                <p>
                    View Style
                    <Button color="primary" onClick={() => setActiveComponent("table")}>
                        <TableViewIcon />
                    </Button>
                    <Button color="primary" onClick={() => setActiveComponent("card")}>
                        <CardViewIcon />
                    </Button>
                </p>
            </div>
            <DirectoryFilters />
            <TableList name="table" />
            <CardList name="card" />
        </div>
    );
}
