import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import LandingForm from '../components/LandingForm/LandingForm'

class LandingContainer extends Component {  
    constructor(props) {
        super(props)
        this.state = {
            badgeId: ''        
        }
      }
    
      handleBadgeInputChange = (e) => {
        this.setState({
          badgeId: e.target.value
        })
      }
    
      handleSearchBadgeSubmit = (e) => {
        e.preventDefault();
        this.props.history.push(`/badgeid/${this.state.badgeId}`)
      }

      render() {
          return (
            <LandingForm handleBadgeInputChange={this.handleBadgeInputChange} handleSearchBadgeSubmit={this.handleSearchBadgeSubmit}/>
          )
      }
}    

export default withRouter(LandingContainer)