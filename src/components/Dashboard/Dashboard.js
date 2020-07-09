import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link } from "react-router-dom";
import axios from 'axios';
import {getSubscritions, userSubscribe} from '../../../functions/FirebaseU/FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

const card = (pathway, state, callSub) => {
    var badgeID = getID(pathway.completionBadge);
    var percent = state.progress[badgeID] / state.badgesCount[badgeID] * 100;
    var subscribed = state.subscribe.includes(badgeID)
    return (
        <div class="col-sm-6">
            <div className="card" style={{marginTop: "15px"}}>
                <h5 className="card-header">{pathway.title}</h5>
                <div className="card-body">
                    <div>
                        {!subscribed ? <button onClick={() => callSub(badgeID)} 
                            className="btn btn-primary"
                        >
                            Request Access
                        </button> : <div/>}
                        <Link style={{marginLeft: !subscribed ? "20px" : ""}} className="btn btn-primary" to={`/pathway/${badgeID}`}>View</Link>
                    </div>
                    <div id="myProgress">
                        <div id="myBar" 
                            style={{width: `${percent}%`}}>{percent ? `${Math.floor(percent)}%` : ""}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const getAwarded = async(email) =>{
    var resp = await axios.get(`/award`)
    return resp.data.result.filter(a => a.recipient.plaintextIdentity === email);
}

class Dashboard extends Component{
    badges = 0;
    constructor(props){
        super(props);
        this.getAwards = this.getAwards.bind(this);
        this.getAwards_aux = this.getAwards_aux.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.state = {pathways: [], subscribe: [], userEmail: "", my_pathways: [], progress: {}, badgesCount: {}};
    }

    getAwards = async(obj, awarded) => {
        var progress = {}
        var badgesCount = {}

        if(obj){
            var pathways = Object.values(obj);
            for(let i = 0; i < pathways.length; i++){
                var count = {};
                count = this.getAwards_aux(pathways[i], awarded);
                badgesCount[getID(pathways[i].completionBadge)]=count.count + 1
                progress[getID(pathways[i].completionBadge)]=count.progress
            }
        }
        this.setState({progress: progress, badgesCount: badgesCount})
    }
     
    getAwards_aux = (obj, awarded) => {
        let awardCount = 0
        if(obj){
            let objID = getID(obj.completionBadge ? obj.completionBadge : obj.requiredBadge ? obj.requiredBadge : "") 
            if(objID){
                awardCount = awarded.filter(a => a.badgeclass === objID).length > 0 ? 1 : 0;
                if(obj.children){
                    let returnObj = {'count': obj.children.length, 'progress': 0}
    
                    for(let j = 0; j <= obj.children.length; j++){
                        returnObj.count += this.getAwards_aux(obj.children[j], awarded).count
                        returnObj.progress += this.getAwards_aux(obj.children[j], awarded).progress
                    }
                    returnObj.progress += awardCount;
                    return returnObj;
                }
            }
        }
        return {'count': 0, 'progress': awardCount};
    }

    async componentDidMount(){
        let allPathways = [];
        let pathways = require(`../../../pathways/pathwaysIDS.json`);
        const user = localStorage.getItem("email");
        console.log("USER", user)
        const awarded = await getAwarded(user);
        console.log("Awarded", awarded);
        for(let x=0;x<pathways.pathways_ids.length;x++){
            let path = Object.values(require(`../../../pathways/${pathways.pathways_ids[x]}.json`))[0]
            allPathways.push(path);
        }
        this.setState({pathways: allPathways, userEmail: user});
        this.getAwards(this.state.pathways, awarded);
        
        getSubscritions(user).on('value', (snapshot) => {
            try {
                if(snapshot.val()){
                    this.setState({subscribe: snapshot.val()})
                }
            } catch (error) {
                console.log("NO SUBS")
            }
        })
        
    }

    subscribe(id){
        var sub = this.state.subscribe.filter(s => s != id);
        this.setState({subscribe: sub.concat([id])})   
        userSubscribe(this.state.userEmail, sub.concat([id]))
    }

    render(){
        return (
            <div>
                <div className="badge-summary jumbotron">
                <h1>Explore</h1>
                </div>
                <div className="body-app">
                    <Tabs style={{width: "100%"}}>
                        <Tab eventKey="available" title="Available">
                            <div className="row">
                                {!this.state.pathways.length?
                                    <div class="col-sm-6">
                                        <br/>
                                        <span>Loading...</span>
                                    </div>
                                    :
                                    this.state.pathways.map((pathway) => 
                                        card(
                                            pathway, 
                                            this.state,
                                            this.subscribe))
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="my_pathways" title="My Pathways">
                            <div className="row">
                                {!this.state.pathways.length?
                                    <div class="col-sm-12">
                                        <br/>
                                        <span>There are currently no pathways here. Request access to one in Avaliable!</span>
                                    </div>
                                    :
                                    this.state.pathways.map((pathway) =>
                                        this.state.subscribe.includes(getID(pathway.completionBadge)) ?
                                        card(pathway, this.state, this.subscribe) : <div/>)
                                }
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Dashboard