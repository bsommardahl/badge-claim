import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import BadgeHeader from '../components/BadgeHeader/BadgeHeader';
import BadgeContent from '../components/BadgeContent/BadgeContent';
import AwardSection from '../components/AwardSection/AwardSection';
import Loading from "react-fullscreen-loading";
import {ToastsContainer, ToastsStore} from 'react-toasts';

class AwardContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            badgeToken: '',
            badgeData: {},            
            query: {},
            display: '',
            isLoading: true
        }
    }

    handleAwardBadge = async(e) => {
        e.preventDefault();
        await axios.post(
            `/award`, 
            {
                email: this.state.query.email,
                authToken: this.state.query.token,
                badgeToken: this.state.badgeToken,
                badgeName: this.state.badgeData.name
            }
        )
        .then(res => {
            ToastsStore.success('Badge has been awarded!')
            this.setState({
                display: 'd-none'
            })
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
        axios.get(`/badges/${params.badge_token}`)
        .then(res => {
            this.setState({
                badgeData: res.data.result[0],
                isLoading: false
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                <Loading loading={this.state.isLoading} background="#d8d8e6" loaderColor="#525dc7" />
                <BadgeHeader imageSource={this.state.badgeData.image} badgeName={this.state.badgeData.name} badgeDescription={this.state.badgeData.description} display="d-none" openModal={this.openModal} showButton={false}/>
                <BadgeContent criteriaNarrative={this.state.badgeData.criteriaNarrative} criteriaURL={this.state.badgeData.criteriaUrl} />
                <AwardSection handleAwardBadge={this.handleAwardBadge} display={this.state.display} email={this.state.query.email} evidence={this.state.query.evidence}/>
                <ToastsContainer store={ToastsStore}/>
            </div>
        )
        
    }
}

export default withRouter(AwardContainer);