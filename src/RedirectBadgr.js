import React, { Component } from 'react';
import { useParams } from "react-router-dom";

class RedirectBadgr extends Component {
    render() {
        var url = window.location.href;
        var array = url.split('/');

        var lastsegment = array[array.length-1];
        window.location = "https://badgr.com/public/badges/" + lastsegment;
        return (
        <div/>
        )
    }
}

export default RedirectBadgr;