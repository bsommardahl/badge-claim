import React from 'react'
import './BadgeHeader.css'

const BadgeHeader = props => 
    <div className="badge-summary jumbotron">
        <div className="container-fluid text-left">
            <div className="row">
                <div className="badge-sidebar offset-sm-0 offset-md-1 offset-lg-2">
                    <img className="badge-image img-fluid" src={props.imageSource} alt="This is a badge"/>                    
                </div>
                <div className="col-4 offset-4">
                    <h1>{props.badgeName}</h1>
                </div>
                <div className="col-2" align="center">
                    <p>
                        <a href="/" className="btn btn-primary claim-badge-button btn-lg">Claim badge</a>
                    </p>
                </div>
                <div className="badge-summary-container col-4 offset-4">
                    <p className="description">{props.badgeDescription}</p>
                </div>
            </div>                    
        </div>
    </div>

export default BadgeHeader;
