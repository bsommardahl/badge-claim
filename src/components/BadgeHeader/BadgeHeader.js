import React from 'react'
import './BadgeHeader.css'

const BadgeHeader = props => 
    <div className="badge-summary jumbotron">
        <div className="container-fluid text-left">
            <div className="row">
                <div className="badge-sidebar offset-sm-0 offset-md-1 offset-lg-2 text-center pt-5">
                    <img className="badge-image img-fluid mb-4" src={props.imageSource} alt="This is a badge"/>
                    <div className="issuer-info">
                        <hi className="h5">
                            Issued by:
                        </hi>
                        <br/>
                        <a href="https://badgr.io/public/issuers/KhURuSXqSNaxI5tS6YytfA" className="issuer-link">Actually Agile</a>
                    </div>                  
                </div>
                <div className="col-3 offset-4">
                    <h1>{props.badgeName}</h1>
                </div>
                <div className={props.display || "col-2"} align="right">
                    <p>
                        <a href="" onClick={props.openModal} className="btn btn-primary claim-badge-button btn-lg">Claim badge</a>
                    </p>
                </div>
                <div className="badge-summary-container col-4 offset-4">
                    <p className="description">{props.badgeDescription}</p>
                </div>
            </div>                    
        </div>
    </div>

export default BadgeHeader;
