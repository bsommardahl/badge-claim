import React from 'react'
import './BadgeHeader.css'

const BadgeHeader = props => 
    <div className="badge-summary jumbotron">
        <div className="container text-left">
            <div className="row">
                <div className="badge-sidebar col-12 col-md-3 text-center pt-5">
                    <img className="badge-image img-fluid mb-4" src={props.imageSource} alt="This is a badge"/>
                    <div className="issuer-info">
                        <hi className="h5">
                            Issued by:
                        </hi>
                        <br/>
                        <a href="https://badgr.io/public/issuers/KhURuSXqSNaxI5tS6YytfA" className="issuer-link">Actually Agile</a>
                    </div>                  
                </div>

                <div className="col-12 col-md-6" style={{ top: "10rem" }}>
                    <div className="row">
                        <div className="col-12">
                            <h1>{props.badgeName}</h1>
                        </div>
                        <div className="badge-summary-container col-12">
                            <p className="description">{props.badgeDescription}</p>
                        </div>
                    </div>
                </div>                

                <div className={props.display || "col-12 col-md-3"} align="right" style={{ top: "10rem" }}>
                    <p>
                        <a href="" onClick={props.openModal} className="btn btn-primary claim-badge-button btn-lg">Claim badge</a>
                    </p>
                </div>
              
            </div>                    
        </div>
    </div>

export default BadgeHeader;
