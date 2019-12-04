import React from 'react'
import './BadgeContent.css'
import ExternalCriteria from '../ExternalCriteria/ExternalCriteria'
import AwarderInfo from '../AwarderInfo/AwarderInfo'
import ReactMarkdown from 'react-markdown'

const BadgeContent = props =>
    <div className="container-fluid">
        <div className="row">
            <div className="col-5 mb-3 offset-4 text-left">
                <h3>Criteria</h3>
                <ReactMarkdown source={props.criteriaNarrative} />
                <ExternalCriteria criteriaURL={props.criteriaURL}></ExternalCriteria>
                <AwarderInfo tags={props.tags}></AwarderInfo>
            </div>
        </div>
    </div>

export default BadgeContent;