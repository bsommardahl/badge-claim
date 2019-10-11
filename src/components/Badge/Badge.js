import React, { Component } from 'react';
import './Badge.css';
import axios from 'axios'

class Badge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            badgeToken: '',
            badgeData: {}
        }
    }
    
    componentDidMount() {
        const { match: {params}} = this.props
        this.setState({
            badgeToken: params.badge_token
        })
        axios
            .get(`/badge/${params.badge_token}`)
            .then(res => {
                this.setState({
                    badgeData: res.data.result[0]
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    render () {        
        return (
            <div className="badge-contaier">
                {/* <p className="badge-message">this is the badge container for badge {this.state.badgeToken}</p>  */}

                <div className="badge-summary">
                    <h1>{this.state.badgeData.name}</h1>
                    <div className="claim-badge-button-container">
                        <button className="claim-badge-button">Claim badge</button>  
                    </div>                  
                </div>
                <div className="badge-container">
                    <div className="badge-sidebar">
                        <img src={this.state.badgeData.image} alt="This is a badge" className="badgeimage"/>
                    </div>
                    <dl>
                        <div className="issued-by"></div>
                        <dt className="issued-on"></dt>
                        <dd className="issue-date"></dd>
                        <dt className="awarded-to"></dt>
                        <dd className="awardee"></dd>
                    </dl>
                    <div className="badge-summary-container">
                        <p className="description">{this.state.badgeData.description}</p>
                    </div>
                </div>
                <div className="badge-description">
                    <h2>{this.state.badgeData.description}</h2>
                </div>
                <div className="badge-info-container">
                    <section className="criteria">
                        <h3>Criteria</h3>
                        <p>{this.state.badgeData.criteriaNarrrative}</p>
                        <a href={this.state.badgeData.criteriaUrl} className="criteria-url-link">View external Criteria URL</a>
                    </section>
                </div>
            </div>
        )
    }
}

export default Badge;
