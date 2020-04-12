import React, { Component } from 'react';
import { useParams } from "react-router-dom";

class RedirectBadgr extends Component {
    render() {
        window.location = "https://chrome.google.com/webstore/detail/badgr-extras/libekojokjjjmhfopdejamgkmloedldj";
        return (
        <div/>
        )
    }
}

export default RedirectBadgr;