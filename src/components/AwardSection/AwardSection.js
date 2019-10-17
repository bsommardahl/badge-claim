import React from 'react'
import './AwardSection.css'

const AwardSection = props => 
    <div className={"container-fluid "+props.display}>
        <div className="row">
            <div className="col-5 offset-4 text-center award-section">
                <h1 className="h2 mb-3">Claiming</h1> 
                <p>{props.email}</p>
                <p>
                    <a href="" onClick={props.handleAwardBadge} className="btn btn-primary award-badge-button btn-lg">Award Badge</a>
                </p>                
            </div>
        </div>
    </div>

export default AwardSection;