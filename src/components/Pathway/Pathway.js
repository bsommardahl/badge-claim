import React from 'react'
import $ from 'jquery';
import axios from 'axios';
import { createPathway } from './NodeGraph';
import { getUserEmail } from '../../../functions/FirebaseU/FirebaseUtils'
import {Link} from 'react-router-dom'
import './Pathway.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

class Pathway extends React.Component{
    constructor(props) {
        super(props);
        this.state = {pathway: {}, userEmail: "", awarded: {}, dataAward: {}}
        this.findEarned = this.findEarned.bind(this);
        this.checkAwarded = this.checkAwarded.bind(this);
    }

    componentWillMount(){
        const { match: {params}} = this.props;
        let pathways = require(`../../../pathways/${params.pathway_id}.json`);
        this.setState({pathway: pathways[params.pathway_id]})
    }

    async componentDidMount(){
        var allPathways = [];
        let pathwaysJson = require(`../../../pathways/pathwaysIDS.json`);
        for(let x=0;x<pathwaysJson.pathways_ids.length;x++){
            let path = Object.values(require(`../../../pathways/${pathwaysJson.pathways_ids[x]}.json`))[0]
            allPathways.push(path);
        }
        createPathway(this.state.pathway, allPathways);
        const resp  = await axios({
            method: 'get',
            url: `/award`,
        })
        const user = await getUserEmail();
        this.setState({userEmail: user.email});
        const getAwarded = resp.data.result.filter(a => a.recipient.plaintextIdentity ===  this.state.userEmail);

        this.checkAwarded(this.state.pathway,getAwarded);
    }

    checkAwarded(pathway, awards){
        if(pathway){
            const badgeId = 
                getID(
                    pathway.completionBadge ? pathway.completionBadge : 
                    pathway.requiredBadge ? pathway.requiredBadge : ""
                )
            if(this.findEarned(badgeId, awards)){
                $(`#${badgeId}`).attr("stroke", "#13bf00")
            }
            if(pathway.pathwayURL){
                for(let x = 0; x < pathway.length; x++){
                    if(getID(pathway[x].completionBadge)===getID(pathway.pathwayURL)){
                        if(pathway[x].children){
                            for(let y=0; y < pathway[x].children.length; y++){
                                this.checkAwarded(pathway[x].children[y], awards);
                            }
                        }
                    }
                }
            }
            if(pathway.children){
                for(let i = 0; i < pathway.children.length; i++){
                    this.checkAwarded(pathway.children[i], awards);
                }
            }
        }
    }
    
    findEarned(badgeId, awards) {
        return awards.filter(a => a.badgeclass === badgeId).length > 0
    }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1></h1>
                        <Link
                            to={`/explore`}
                            className="btn btn-primary"
                        >
                         Back
                        </Link>
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
                        style={{textAlign: "center", overflow: "auto", height: "auto", width: "80%"}}
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