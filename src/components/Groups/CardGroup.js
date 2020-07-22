import React from 'react';
import {Link} from 'react-router-dom'

const CardGroup = ({id,name,description}) =>{
    return(
        <div className="row d-flex justify-content-between border border-dark">
            <p>{id}</p>
            <p>{name}</p>
            <p>{description}</p>
            <Link to={{
                    pathname:`/groups/edit/${id}`,
                    aboutProps:{
                        name:name,
                        desc: description,
                        id: id,
                    }    
            }} className="btn btn-primary"
            >Edit</Link>
        </div>
    )
}
export default CardGroup;