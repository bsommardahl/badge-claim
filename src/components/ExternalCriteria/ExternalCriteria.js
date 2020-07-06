import React from 'react'

const ExternalCriteria = (props) => {
    if(props.criteriaURL) {        
        return <a href={props.criteriaURL}  target="_blank" className="criteria-url-link">Click here to view details</a>        
    }
    return <div></div>
}

export default ExternalCriteria;