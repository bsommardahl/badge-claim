import React, { Component } from 'react';
import Loading from 'react-fullscreen-loading';
import axios from 'axios';
import BadgeListItem from '../components/BadgeListItem/BadgeListItem'

class BadgeListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            badges: [],
            isLoading: true
        }
    }

    componentDidMount() {
        axios
            .get(`/badges`)
            .then(res => {
                this.setState({
                    badges: res.data.result,
                    isLoading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }    

    render() {
        const badgeList = this.state.badges.map((badge) =>
                <BadgeListItem badge={badge} /> 
        )

        return (
            <div>
                <Loading loading={this.state.isLoading} background="#d8d8e6" loaderColor="#525dc7" />
                <div className="container-fluid d-flex flex-wrap">
                        {badgeList}
                </div>
            </div>
        )
    }
}

export default BadgeListContainer;