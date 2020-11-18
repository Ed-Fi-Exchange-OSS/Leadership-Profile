import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

const BreadcrumbList = (props) => {
    return (
        <div>
            <Breadcrumb>
                <BreadcrumbItem active>Home</BreadcrumbItem>
            </Breadcrumb>
        </div>
    );
};

export default BreadcrumbList;