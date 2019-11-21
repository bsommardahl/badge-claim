import React from 'react'
import './ExternalCriteria.css'

const ExternalCriteria = (props) => {
    if(props.criteriaURL) {        
        return <a href={props.criteriaURL}  target="_blank" className="criteria-url-link">View external Criteria URL</a>        
    }
    return <div></div>
}

export default ExternalCriteria;