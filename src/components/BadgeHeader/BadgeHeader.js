import React from 'react'
import './BadgeHeader.css'

const BadgeHeader = props => 
    <div className="badge-summary jumbotron">
        <div className="container-fluid text-left">
            <div className="space">
                <div className="column center sections">
                    <div>
                        <img className="badge-image container-fluid" src={props.imageSource} alt="This is a badge"/>                  
                    </div>
                    <div>
                        <hi>
                            Issued by:
                        </hi>
                        <br/>
                        <a href="https://badgr.io/public/issuers/KhURuSXqSNaxI5tS6YytfA" className="issuer-link">Actually Agile</a>
                    </div>
                </div>
                <div className="column center info sections">
                    <div className="titleV">
                        <h1>{props.badgeName}</h1>
                    </div>
                    <div className="badge-summary-container">
                        <p className="description">{props.badgeDescription}</p>
                    </div>
                </div>
                <div className="center sections">
                    <p className="buttonV">
                        <a href="" onClick={props.openModal} className="btn btn-primary claim-badge-button btn-lg">Claim badge</a>
                    </p>
                </div>
            </div>                    
        </div>
    </div>

export default BadgeHeader;
