import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import './AwardSection.css'

function replaceMulti(str, findings, replacings) {
    var newStr = str;
    var regex; 
    for (var i = 0; i < findings.length; i++) {
      regex = new RegExp(findings[i], "g");
      newStr = newStr.replace(regex, replacings[i]);
    }
    return newStr;
};

const AwardSection = props => 
    <div className={"container-fluid "+props.display}>
        <div className="row">
            <div className="col-5 offset-4 text-center award-section">
                <h1 className="h2 mb-3">Claiming</h1> 
                <p>Email: {props.email}</p>
                <p>Evidence:</p>
                <p className="justify">{
                    ReactHtmlParser(unescape(replaceMulti(
                    props.evidence+"",
                    ['%40','%2D','%5F','%2F','%2E','%2A'],
                    ['@','-','_','/','.','*'])).replace(/((http:|https:)[^\s]+[\w])/g, '<a href="$1" target="_blank">$1</a>'))
                }</p>
                <p>
                    <a href="" onClick={props.handleAwardBadge} className="btn btn-primary award-badge-button btn-lg">Award Badge</a>
                </p>                
            </div>
        </div>
    </div>

export default AwardSection;