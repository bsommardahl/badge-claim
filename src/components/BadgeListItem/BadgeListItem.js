import React from 'react'
import { withRouter } from 'react-router-dom'

const BadgeListItem = props => 
    <div onClick = {() => props.history.push(`/badges/${props.badge.entityId}`)}>
        <div>
            <img alt="Badge Image" className="badge-image img-fluid" src={props.badge.image}/> 
        </div>
        <div>
            <h1 className="h3">{props.badge.name}</h1>
        </div>
    </div>

export default withRouter(BadgeListItem);

