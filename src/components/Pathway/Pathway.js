import React from 'react'
import { createPathway } from './NodeGraph';
import axios from 'axios';
import './Pathway.css'

const line = (d) => {
    var half = d.xori + (d.xdes - d.xori)/2
    return "M" + 
        d.xori + "," + d.yori + 
        " L " + half + "," + d.yori +
        " L " + half + "," + d.ydes +
        " L " + d.xdes + "," + d.ydes;
}

const getAwarded = async(email) => {
    var resp = await axios({
        method: 'get',
        url: `/award`,
    })
    return resp.data.result.filter(a => a.recipient.plaintextIdentity ===  email);;
}

function findEarned(badge, awards) {
    var partbadge = String(badge.url).split('/');
    var badgeId = partbadge[partbadge.length-1];
    return awards.filter(a => a.badgeclass === badgeId).length > 0
}

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

class Pathway extends React.Component{
    constructor(props) {
        super(props);
        this.state = {pathway: {}, userEmail: "", awarded: {}, dataAward: {}, data: {nodes:[], links: []}, height: 0}
        this.handleClick = this.handleClick.bind(this);
        this.checkForErrors = this.checkForErrors.bind(this);
    }

    checkForErrors(path, count){
        if(path.children && path.children.length>0 && count<20){
            count++;
            this.checkForErrors(path.children[0], count)
        }else if(count>=20){
            const { match: {params}} = this.props;
            let pathways = require(`../../../pathways/${params.pathway_id}.json`);
            this.checkForErrors(pathways[params.pathway_id], 0)
        }
    }

    async componentDidMount(){
        const { match: {params}} = this.props;
        let pathways = require(`../../../pathways/${params.pathway_id}.json`);
        pathways = {}
        pathways = require(`../../../pathways/${params.pathway_id}.json`);
        this.checkForErrors(pathways[params.pathway_id], 0);

        this.setState({pathway: pathways[params.pathway_id]})

        var allPathways = [];
        const user = localStorage.getItem("email");
        var dataAward = await getAwarded(user.email);
        this.setState({userEmail: user.email, dataAward: dataAward});
        let pathwaysJson = require(`../../../pathways/pathwaysIDS.json`);
        for(let x=0;x<pathwaysJson.pathways_ids.length;x++){
            let path = Object.values(require(`../../../pathways/${pathwaysJson.pathways_ids[x]}.json`))[0]
            allPathways.push(path);
        }
        const data = createPathway(this.state.pathway, allPathways, user.email, dataAward);
        this.setState({data: data})
    }
    
    handleClick(e) {
        if(e.url){
          window.location = `/badgeid/${getID(e.url)}`;
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1></h1>
                    </div>
                    <div style={{marginLeft: '10%'}}>
                        <ul>
                            <li style={{color:"#535dc8"}}>Not Awarded</li>
                            <li style={{color:"#ffdd00"}}>Completion Badge</li>
                            <li style={{color:"#13bf00"}}>Awarded</li>
                        </ul>
                    </div>
                    <div 
                        className="pathway-div"
                        style={{textAlign: "center", overflow: "auto", height: "500px", width: "80%"}}
                    >
                        <div class="progress-bar">
                            <div class="progress-bar-value"></div>
                        </div>
                        <div id="my_dataviz">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Pathway;