import React from 'react';

const BreadcrumbList = (props) => {
    const { currentPage } = props;

    return (
        <div className="breadcrumb-div">
            <div>
                <div>
                    <a href="/" className={currentPage === "profile" ? "previous-page" : "current-page"}>Home</a>
                    <span> &gt; </span>
                    {currentPage === 'profile' ? 
                        (<a href="#" className="current-page">Contact details</a>)
                        : ''
                    }
                    
                </div>
            </div>
        </div>
    );
};

export default BreadcrumbList;