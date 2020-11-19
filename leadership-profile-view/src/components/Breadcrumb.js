import React from 'react';

const BreadcrumbList = (props) => {
    // This will need to me refactored to be dynamic or maybe conditionals. 
    // Maybe pass in the path? For now, it should not be more than Home and Contact details. 
    return (
        <div>
            <div>
                <a href="/" className="previous-page">Home</a>
                <span> &gt; </span>
                <a href="#" className="current-page">Contact details</a>
            </div>
        </div>
    );
};

export default BreadcrumbList;