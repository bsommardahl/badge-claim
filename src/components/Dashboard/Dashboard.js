import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Collapse from 'react-bootstrap/Collapse';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from "react-router-dom";
import axios from 'axios';
import {getSubscritions, userSubscribe} from '../../../functions/FirebaseU/FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

class PathwayCard extends Component{
    constructor(props){
        super(props);
        this.state = {open: false};
        this.openCollapse = this.openCollapse.bind(this)
    }

    openCollapse(){
        this.setState({open: !this.state.open})
    }

    render(){
        var badgeID = getID(this.props.pathway.completionBadge);
        var percent = this.props.data.progress[badgeID] / this.props.data.badgesCount[badgeID] * 100;
        var subscribed = this.props.data.subscribe.includes(badgeID)
        return (
            <div class="col-sm-6">
                <div className="card" style={{marginTop: "15px"}}>
                    <h5 className="card-header">{this.props.pathway.title}</h5>
                    <div className="card-body">
                        <div>
                            {!subscribed ? <button onClick={() => this.props.callSub(badgeID)} 
                                className="btn btn-primary btn-sm"
                            >
                                Request Access
                            </button> : <div/>}
                            <Link 
                                style={{marginLeft: !subscribed ? "20px" : ""}} 
                                className="btn btn-primary btn-sm" 
                                to={`/pathway/${badgeID}`}
                            >
                                View
                            </Link>
                            <button
                                style={{marginLeft: "20px"}}
                                className="btn btn-primary btn-sm"
                                onClick={() => this.openCollapse()} 
                            >
                                Progress
                            </button>
                        </div>
                        <Collapse in={this.state.open}>
                        <div className="progress">
  <div className="progress-bar bg-success" role="progressbar" style={{width: "25%"}} ariaValueNow="25" ariaValueMin="0" ariaValueMax="100"></div>
</div>
                        </Collapse>
                    </div>
                </div>
            </div>
        )
    }
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

    getAwards = (obj, awarded) => {
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
        window.onpopstate  = (e) => {
            window.location.reload();
        }
        let allPathways = [];
        let pathways = require(`../../../pathways/pathwaysIDS.json`);
        const user = localStorage.getItem("email");
        const awarded = await axios.get(`/award`);
        const awardsByUser = awarded.data.result.filter(a => a.recipient.plaintextIdentity === user);
        for(let x=0;x<pathways.pathways_ids.length;x++){
            let path = Object.values(require(`../../../pathways/${pathways.pathways_ids[x]}.json`))[0]
            allPathways.push(path);
        }
        this.setState({pathways: allPathways, userEmail: user});
        this.getAwards(this.state.pathways, awardsByUser);
        
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
                                        <PathwayCard pathway={pathway} data={this.state} callSub={this.subscribe}/>)
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
                                        <PathwayCard pathway={pathway} data={this.state} callSub={this.subscribe}/> : <div/>)
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