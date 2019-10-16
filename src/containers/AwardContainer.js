import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import BadgeHeader from '../components/BadgeHeader/BadgeHeader';
import BadgeContent from '../components/BadgeContent/BadgeContent';
import AwardSection from '../components/AwardSection/AwardSection';

class AwardContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            badgeToken: '',
            badgeData: {},            
            query: {}
        }
    }

    handleAwardBadge = async(e) => {
        e.preventDefault();
        await axios.
            post(
                `/award`, {
                    email: this.state.query.email,
                    authToken: this.state.query.token,
                    badgeToken: this.state.badgeToken
                }
            )
            .then(res => {
                console.log('display success toast')
                this.props.history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        const { match: {params}} = this.props
        this.setState({
            query: QueryString.parse(this.props.location.search),
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
                <BadgeHeader imageSource={this.state.badgeData.image} badgeName={this.state.badgeData.name} badgeDescription={this.state.badgeData.description} buttonClass="d-none" openModal={this.openModal}/>
                <BadgeContent criteriaNarrative={this.state.badgeData.criteriaNarrative} criteriaURL={this.state.badgeData.criteriaUrl} />
                <AwardSection handleAwardBadge={this.handleAwardBadge} email={this.state.query.email}/>
            </div>
        )
        
    }
}

export default withRouter(AwardContainer);