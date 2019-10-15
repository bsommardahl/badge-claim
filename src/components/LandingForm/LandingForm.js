import React from 'react';
import './LandingForm.css';
import icon from '../../images/badgeIcon.png';

const LandingForm = props => 
    <div className="form-container">
        <form className="form-badge-search" onSubmit={props.handleSearchBadgeSubmit}>
            <img class="mb-4 badge-icon" src={icon} alt="" width="72" height="72"/>
            <h1 className="h3 mb-3 font-weight-normal">Looking for a badge?</h1>
            <label htmlFor="badgeId" className="sr-only">Badge Id</label>
            <input type="text" id="badgeId" className="form-control mb-3" onChange={props.handleBadgeInputChange} placeholder="Badge Id"/>
            <button className="btn btn-lg btn-primary btn-block search-button">Search</button>
        </form>                   
    </div>

export default LandingForm;