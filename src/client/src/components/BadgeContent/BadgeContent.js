import React from 'react'
import './BadgeContent.css'
import ReactMarkdown from 'react-markdown';

const BadgeContent = props => 
    <div className="row">
        <div className="col-10 offset-4 text-left">
        <h3>Criteria</h3>
        <ReactMarkdown source={props.criteriaNarrative} />
        <a href={props.criteriaURL} className="criteria-url-link">View external Criteria URL</a>
        </div>
    </div>                    

export default BadgeContent;