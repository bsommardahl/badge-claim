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
            <div className="badge-container">
                <div className="badge-summary jumbotron">
                    <div className="container-fluid text-left">
                        <div className="row">
                            <div className="badge-sidebar offset-sm-0 offset-md-1 offset-lg-2">
                                <img className="badge-image img-fluid" src={this.state.badgeData.image} alt="This is a badge"/>                    
                            </div>
                            <div className="col-4 offset-4">
                                <h1>{this.state.badgeData.name}</h1>
                            </div>
                            <div className="col-2" align="center">
                                <p>
                                    <a href="/" className="btn btn-primary claim-badge-button btn-lg">Claim badge</a>
                                </p>
                            </div>
                            <div className="badge-summary-container col-4 offset-4">
                                <p className="description">{this.state.badgeData.description}</p>
                            </div>
                        </div>                    
                    </div>
                </div>              
                <div className=" container-fluid">  
                    <div className="row">
                        <div className="col-10 offset-4 text-left">
                        <h3>Criteria</h3>
                        <p>{this.state.badgeData.criteriaNarrative}</p>
                        <a href={this.state.badgeData.criteriaUrl} className="criteria-url-link">View external Criteria URL</a>
                        </div>
                    </div>                    
                </div>
            </div>
        )
    }
}

export default Badge;
