import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import './Landing.css'
import icon from '../../images/badgeIcon.png' 

class Landing extends Component {
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
          return(
            <div className="form-container">
                <form className="form-badge-search" onSubmit={this.handleSearchBadgeSubmit}>
                    <img class="mb-4 badge-icon" src={icon} alt="" width="72" height="72"/>
                    <hi className="h3 mb-3 font-weight-normal">Looking for a badge?</hi>
                    <label htmlFor="badgeId" className="sr-only">Badge Id</label>
                    <input type="text" id="badgeId" className="form-control mb-3" onChange={this.handleBadgeInputChange} placeholder="Badge Id"/>
                    <button className="btn btn-lg btn-primary btn-block search-button">Search</button>
                </form>                   
            </div>
          )
      }
}    

export default withRouter(Landing)