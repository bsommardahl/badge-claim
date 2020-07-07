import React from 'react'
import { createPathway } from './NodeGraph';
import './Pathway.css'
import {getUserEmail} from '../../../functions/FirebaseU/FirebaseUtils'

class Pathway extends React.Component{
    constructor(props) {
        super(props);
        this.state = {pathway: null, userEmail: "", awarded: null}
    }

    async componentDidMount(){
        var allPathways = [];
        let pathwaysJson = require(`../../../pathways/pathwaysIDS.json`);
        for(let x=0;x<pathwaysJson.pathways_ids.length;x++){
            let path = Object.values(require(`../../../pathways/${pathwaysJson.pathways_ids[x]}.json`))[0]
            allPathways.push(path);
        }
        const { match: {params}} = this.props;
        const user = await getUserEmail();
        this.setState({userEmail: user.email});
        
        let pathways = require(`../../../pathways/${params.pathway_id}.json`);
        if(pathways!==null && pathways!==undefined)
           createPathway(pathways[`${params.pathway_id}`], this.state.userEmail, allPathways)
        else
            alert("The pathway doesn't exist");
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