import React from 'react'
import ExternalCriteria from '../ExternalCriteria/ExternalCriteria'
import AwarderInfo from '../AwarderInfo/AwarderInfo'
import ReactMarkdown from 'react-markdown'

const BadgeContent = props =>
    <div className="container-fluid">
        <div className="row" style={{marginLeft:"8%", marginRight:"8%"}}>
            <div className="col-8 mb-3 text-left">
                <h3>Criteria</h3>
                <ReactMarkdown source={props.criteriaNarrative} />
                <ExternalCriteria criteriaURL={props.criteriaURL}></ExternalCriteria>
            </div>
            <div className="col-4" style={{wordWrap: "break-word"}}>
                <AwarderInfo tags={props.tags}></AwarderInfo>
            </div>
        </div>
    </div>

export default BadgeContent;