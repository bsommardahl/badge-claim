import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from "react-router-dom";
import axios from 'axios';
import {getSubscritions, userSubscribe} from '../../../functions/FirebaseU/FirebaseUtils'
import './Dashboard.css'

const getID = (str) => str.substring(str.lastIndexOf('/') + 1);

class PathwayCard extends Component{
    constructor(props){
        super(props);
        this.state = {open: false, badgesCount: 0, awardsCount: 0};
        this.openCollapse = this.openCollapse.bind(this);
        this.getChildCount_V2 = this.getChildCount_V2.bind(this);
    }

    openCollapse(){
        this.getChildCount_V2(this.props.pathway)
        this.setState({open: !this.state.open})
    }

    getChildCount_V2(pathway){
        if(pathway){
            if(pathway.completionBadge || pathway.requiredBadge)
                this.setState({badgesCount: this.state.badgesCount += 1});

            const id = getID(
                pathway.completionBadge ? 
                pathway.completionBadge : pathway.requiredBadge ? pathway.requiredBadge : "");
            const assertion = this.props.data.awardsUser.filter(a => a.badgeclass===id);
            if(assertion.length > 0){
                this.setState({awardsCount: this.state.awardsCount += 1});
            }
            if(pathway.pathwayURL){
                for(let x=0;x<this.props.data.pathways.length;x++){
                    if(getID(this.props.data.pathways[x].completionBadge)===getID(pathway.pathwayURL)){
                        if(this.props.data.pathways[x].children){
                            for(let y=0; y < this.props.data.pathways[x].children.length; y++){
                                this.getChildCount_V2(this.props.data.pathways[x].children[y]);
                            }
                        }
                    }
                }
            }
            if(pathway.children){
                for(let i = 0; i < pathway.children.length; i++){
                    this.getChildCount_V2(pathway.children[i]);
                }
            }

        }
    }

    render(){
        var badgeID = getID(this.props.pathway.completionBadge);
        var percent = (this.state.badgesCount > 0 ? ((this.state.awardsCount/this.state.badgesCount)*100).toFixed(0)+"%" : "0%")
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
                        <br/>
                        <Collapse in={this.state.open}>
                            <div className="progress" >
                                <div className="progress-bar bg-success" role="progressbar" 
                                    style={{width: percent, height: "100%", position: "relative", textAlign:"center", lineHeight:"1"}} 
                                    ariaValueNow="25" ariaValueMin="0" ariaValueMax="100">{percent}</div>
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
        this.subscribe = this.subscribe.bind(this);
        this.state = {pathways: [], subscribe: [], userEmail: "", my_pathways: [], awardsUser: [] ,progress: {}, badgesCount: {}};
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
        this.setState({pathways: allPathways, userEmail: user, awardsUser: awardsByUser});
        
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