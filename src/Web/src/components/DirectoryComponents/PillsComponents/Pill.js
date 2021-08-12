import React from 'react';

const Pill = (props) =>{
    const {label, value, handleRemove} = props
    return(
        <React.Fragment>
            <div className="pill" key={`${label}-${value}`}>
                {label}
                <span className="remove-pill" onClick={() => handleRemove()}>x</span>
            </div>
        </React.Fragment>
    )
}

export default Pill;