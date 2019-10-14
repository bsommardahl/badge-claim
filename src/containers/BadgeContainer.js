import React, { Component } from 'react'
import axios from 'axios';
import BadgeHeader from '../components/BadgeHeader/BadgeHeader'
import BadgeContent from '../components/BadgeContent/BadgeContent'

class BadgeContainer extends Component {
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

    render() {
        return (
            <div>
                <BadgeHeader imageSource={this.state.badgeData.image} badgeName={this.state.badgeData.name} badgeDescription={this.state.badgeData.description}/>
                <div className="container-fluid">
                    <BadgeContent criteriaNarrative={this.state.badgeData.criteriaNarrative} criteriaURL={this.state.badgeData.criteriaUrl} />
                </div>
            </div>
        )
        
    }
}

export default BadgeContainer;