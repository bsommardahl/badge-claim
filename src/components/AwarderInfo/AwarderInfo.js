import React from 'react'
import './AwarderInfo.css'

const AwarderInfo = (props) => {
    let awarderEmail;

    const tags = props.tags

    if(tags) {
        tags.forEach((tag, i) => {
            if(tag.includes('awarder')) {
                let email = tag.split(':')[1].trim()             
                
                awarderEmail = email;
            }        
        })
    }


    if(awarderEmail) {        
        return <p>Badge Awarder/Subject Matter Expert: {awarderEmail}</p>        
    }

    return <div></div>
}

export default AwarderInfo;